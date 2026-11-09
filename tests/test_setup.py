"""Black-box tests for the CamSkills installer, using isolated agent directories."""
from __future__ import annotations

import os
from pathlib import Path
import re
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
SETUP = ROOT / "setup"


class SetupTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="camskills-setup-test-")
        self.addCleanup(self.temp.cleanup)
        root = Path(self.temp.name)
        self.open_dir = root / "opencode/skills"
        self.codex_dir = root / "codex/skills"
        self.state = root / "state"
        self.env = dict(os.environ)
        self.env.update({
            "CAMSKILLS_OPENCODE_DIR": str(self.open_dir),
            "CAMSKILLS_CODEX_DIR": str(self.codex_dir),
            "XDG_STATE_HOME": str(self.state),
            "NO_COLOR": "1",
            "TERM": "dumb",
        })

    def run_setup(self, *args, expected=0, script=SETUP):
        proc = subprocess.run([str(script), *args], cwd=ROOT, env=self.env,
                              text=True, capture_output=True, check=False)
        self.assertEqual(proc.returncode, expected,
                         f"argv={args} exit={proc.returncode}\n{proc.stdout}\n{proc.stderr}")
        return proc.stdout

    def test_read_only_commands_never_create_destinations(self):
        output = self.run_setup("list")
        self.assertRegex(output, r"\d+ unique skills")
        self.assertIn("pstack/tdd", output)
        self.run_setup("status")
        self.run_setup("doctor")
        self.run_setup("install", "--dry-run", "--profile", "all")
        self.assertFalse(self.open_dir.exists())
        self.assertFalse(self.codex_dir.exists())
        self.assertFalse(self.state.exists())

    def test_core_install_is_idempotent_and_picks_correct_sources(self):
        out = self.run_setup("install", "--profile", "core", "-y")
        self.assertIn("28 links created", out)
        assert (self.open_dir / "cam-route").is_symlink()
        assert (self.codex_dir / "cam-route").is_symlink()
        self.assertEqual((self.open_dir / "cam-route").resolve(),
                         ROOT / "skills/workflow/cam-route")
        self.assertEqual((self.codex_dir / "cam-route").resolve(),
                         ROOT / "skills/workflow/cam-route")
        self.assertEqual((self.codex_dir / "tdd").resolve(),
                         ROOT / "skills/engineering/tdd")
        again = self.run_setup("install", "--profile", "core", "-y")
        self.assertIn("Nothing to change", again)
        self.run_setup("doctor")

    def test_conflicts_are_never_destroyed_by_default(self):
        existing = self.open_dir / "cam-route"
        existing.mkdir(parents=True)
        (existing / "CUSTOM.txt").write_text("important user data")
        result = self.run_setup("install", "--skill", "cam-route",
                                "--agent", "opencode", "-y", expected=2)
        self.assertIn("preserved", result)
        self.assertEqual((existing / "CUSTOM.txt").read_text(), "important user data")
        self.assertFalse(existing.is_symlink())
        self.assertFalse(self.state.exists())

    def test_replace_creates_backup_and_remove_preserves_foreign_paths(self):
        existing = self.open_dir / "cam-route"
        existing.mkdir(parents=True)
        (existing / "CUSTOM.txt").write_text("important user data")
        output = self.run_setup("install", "--skill", "cam-route",
                                "--agent", "opencode", "--replace", "-y")
        self.assertIn("backed up", output)
        self.assertTrue(existing.is_symlink())
        backed_up = list((self.state / "camskills/backups").glob("*/opencode/cam-route/CUSTOM.txt"))
        self.assertEqual(len(backed_up), 1)
        self.assertEqual(backed_up[0].read_text(), "important user data")
        self.run_setup("remove", "--skill", "cam-route", "--agent", "opencode", "-y")
        self.assertFalse(existing.exists())
        self.assertTrue(backed_up[0].exists())

        existing.mkdir(parents=True)
        (existing / "SENTINEL").write_text("do not remove")
        self.run_setup("remove", "--skill", "cam-route",
                       "--agent", "opencode", "-y")
        self.assertEqual((existing / "SENTINEL").read_text(), "do not remove")

    def test_broken_link_is_preserved_without_replace(self):
        path = self.codex_dir / "doc-system"
        path.parent.mkdir(parents=True)
        path.symlink_to("/no/such/skill")
        self.run_setup("install", "--skill", "doc-system",
                       "--agent", "codex", "-y", expected=2)
        self.assertEqual(os.readlink(path), "/no/such/skill")
        self.run_setup("install", "--skill", "doc-system",
                       "--agent", "codex", "--replace", "-y")
        self.assertEqual(path.resolve(), ROOT / "skills/workflow/doc-system")

    def test_all_deduplicates_pstack_tdd_and_teach(self):
        output = self.run_setup("install", "--profile", "all", "--dry-run",
                                "--agent", "codex")
        count = int(re.search(r"(\d+) selected skills", output).group(1))
        self.assertEqual(count, 141)
        self.run_setup("install", "--profile", "pstack", "--agent", "codex", "-y")
        self.assertEqual((self.codex_dir / "tdd").resolve(),
                         ROOT / "skills/engineering/tdd")
        self.assertEqual((self.codex_dir / "teach").resolve(),
                         ROOT / "skills/engineering/teach")

    def test_invalid_selection_and_noninteractive_write(self):
        self.run_setup("install", "--category", "unknown", "-y", expected=2)
        self.run_setup("install", "--skill", "not-a-skill", "-y", expected=2)
        result = self.run_setup("install", "--profile", "core", expected=1)
        self.assertIn("require --yes", result)
        self.assertFalse(self.open_dir.exists())

    def test_legacy_installer_shim_works(self):
        self.run_setup("--skill", "cam-route", "--agent", "opencode", "-y",
                       script=ROOT / "install.sh")
        self.assertTrue((self.open_dir / "cam-route").is_symlink())


if __name__ == "__main__":
    unittest.main()
