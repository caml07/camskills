"""Guard documentation links and the catalog's published totals."""
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
PAGES = (
    ROOT / "README.md",
    ROOT / "CONTRIBUTING.md",
    ROOT / "docs/INSTALL.md",
    ROOT / "docs/CATALOG.md",
    ROOT / "codex/README.md",
)


class DocsTests(unittest.TestCase):
    def test_local_markdown_links_resolve(self):
        for path in PAGES:
            with self.subTest(page=str(path.relative_to(ROOT))):
                for ref in re.findall(r"!?\]\(([^)]+)\)", path.read_text()):
                    if ref.startswith(("https://", "http://", "mailto:", "#")):
                        continue
                    target = ref.split("#", 1)[0].split("?", 1)[0]
                    if target:
                        self.assertTrue((path.parent / target).exists(),
                                        f"{path.relative_to(ROOT)} -> {ref}")

    def test_catalog_total_is_current(self):
        names = set()
        for category in (ROOT / "skills").iterdir():
            if not category.is_dir():
                continue
            for directory in category.iterdir():
                if (directory / "SKILL.md").is_file():
                    names.add(directory.name)
        self.assertIn(f"**{len(names)} skills únicas**", (ROOT / "README.md").read_text())

    def test_markdown_code_fences_balance(self):
        for path in PAGES:
            with self.subTest(page=str(path.relative_to(ROOT))):
                fences = sum(line.startswith(chr(96)*3) for line in path.read_text().splitlines())
                self.assertEqual(fences % 2, 0, str(path.relative_to(ROOT)))


if __name__ == "__main__":
    unittest.main()
