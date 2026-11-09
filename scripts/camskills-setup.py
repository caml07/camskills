#!/usr/bin/env python3
"""CamSkills setup: safe, zero-dependency skill linking for coding agents.

Optional 'gum' enriches interactive menus. Nothing is written by list,
status, doctor, help or --dry-run.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import os
from pathlib import Path
import shutil
import subprocess
import sys


ROOT = Path(__file__).resolve().parent.parent
CATALOG_ROOT = ROOT / "skills"
HOME = Path.home()
OPENCODE_DIR = Path(os.environ.get("CAMSKILLS_OPENCODE_DIR") or
                    os.environ.get("OPENCODE_SKILLS_DIR") or
                    str(HOME / ".config/opencode/skills")).expanduser()
CODEX_DIR = Path(os.environ.get("CAMSKILLS_CODEX_DIR") or
                 str(HOME / ".agents/skills")).expanduser()
STATE_DIR = Path(os.environ.get("XDG_STATE_HOME") or
                 str(HOME / ".local/state")).expanduser() / "camskills"
HAS_TTY = sys.stdin.isatty() and sys.stdout.isatty()
COLOR = sys.stdout.isatty() and "NO_COLOR" not in os.environ and os.environ.get("TERM") != "dumb"
GUM = shutil.which("gum") if HAS_TTY else None

CORE = (
    "cam-route", "ai-native-workflow", "grilling", "junior-to-senior",
    "code-review", "diagnosing-bugs", "tdd", "doc-system", "impeccable",
    "security-audit", "create-verification-skill", "maintain-verification-skill",
    "no-commit-secrets", "no-use-effect",
)
PROFILE_LABELS = {
    "core": "Essentials   - routing, tests, verification, review",
    "web": "Web + Design - frontend and UI workflows",
    "mobile": "Mobile      - Expo and React Native",
    "engineering": "Engineering - planning, implementation and code review",
    "pstack": "Pstack      - advanced agent workflows (65 public)",
    "all": "Everything  - all skills, without duplicate aliases",
    "custom": "Custom      - choose categories",
}
AGENTS = ("opencode", "codex")


def paint(value: str, color: str) -> str:
    colors = {"green": "38;5;114", "gray": "38;5;245", "bold": "1", "red": "38;5;203",
              "cyan": "38;5;81", "amber": "38;5;221"}
    if not COLOR:
        return value
    return f"\033[{colors[color]}m{value}\033[0m"


def heading(title: str, note: str = "") -> None:
    print()
    print(paint("╭──────────────────────────────────────────────────╮", "green"))
    print(paint("│" + ("  CAMSKILLS   /   " + title).ljust(50) + "│", "green"))
    print(paint("╰──────────────────────────────────────────────────╯", "green"))
    if note:
        print(f"  {paint(note, 'gray')}")
    print()


def line(kind: str, text: str) -> None:
    symbols = {"ok": ("✓", "green"), "skip": ("–", "gray"), "warn": ("!", "amber"),
               "bad": ("✕", "red"), "info": ("›", "cyan")}
    symbol, color = symbols[kind]
    print(f"  {paint(symbol, color)}  {text}")


def catalog() -> tuple[dict[str, Path], dict[str, list[str]], list[str]]:
    chosen: dict[str, Path] = {}
    groups: dict[str, list[str]] = {}
    duplicates: list[str] = []
    if not CATALOG_ROOT.is_dir():
        raise ValueError(f"Missing skills directory: {CATALOG_ROOT}")
    # Prefer first-party/curated aliases over vendor-internal copies.
    names = [p.name for p in CATALOG_ROOT.iterdir() if p.is_dir()]
    for category in sorted(names, key=lambda name: (name == "pstack", name)):
        group = []
        for skill in sorted((CATALOG_ROOT / category).iterdir()):
            if not skill.is_dir() or not (skill / "SKILL.md").is_file():
                continue
            if skill.name in chosen:
                duplicates.append(f"{category}/{skill.name}")
                continue
            chosen[skill.name] = skill
            group.append(skill.name)
        groups[category] = group
    return chosen, groups, duplicates


def selected_skills(args: argparse.Namespace, entries: dict[str, Path],
                    groups: dict[str, list[str]], profile: str | None = None,
                    categories: list[str] | None = None) -> list[str]:
    names: set[str] = set()
    profile = profile or args.profile
    if not profile and not args.category and not args.skill and not categories:
        profile = "core"

    if profile in ("core", "web", "mobile", "engineering", "pstack"):
        names.update(CORE)
    if profile in ("web", "mobile", "engineering", "pstack"):
        groups_to_add = {
            "web": ("design",), "mobile": ("mobile",),
            "engineering": ("engineering",), "pstack": ("pstack",),
        }[profile]
        for category in groups_to_add:
            names.update(groups.get(category, []))
        if profile == "pstack":
            # Vendor-private tdd/teach are intentionally shadowed by curated versions.
            names.update(("tdd", "teach"))
    if profile == "all":
        names.update(entries)
    for category in list(args.category or []) + list(categories or []):
        if category not in groups:
            raise ValueError(f"Unknown category: {category}. Choose from: {', '.join(sorted(groups))}")
        names.update(groups[category])
    for name in args.skill or []:
        if name not in entries:
            raise ValueError(f"Unknown skill: {name}")
        names.add(name)
    return sorted(names)


def source_for(name: str, agent: str, entries: dict[str, Path]) -> Path:
    if agent == "codex":
        alias = ROOT / "codex/.agents/skills" / name
        if alias.is_dir() and (alias / "SKILL.md").is_file():
            return alias
    return entries[name]


def destination_for(name: str, agent: str) -> Path:
    return (OPENCODE_DIR if agent == "opencode" else CODEX_DIR) / name


def path_exists(path: Path) -> bool:
    return path.exists() or path.is_symlink()


def state_for(dest: Path, source: Path) -> str:
    if dest.is_symlink():
        try:
            if dest.resolve(strict=True) == source.resolve(strict=True):
                return "linked"
        except (OSError, RuntimeError):
            pass
    return "conflict" if path_exists(dest) else "missing"


def choice(header: str, options: list[str]) -> str | None:
    if GUM:
        proc = subprocess.run(["gum", "choose", "--header", header, "--height", "12",
                               "--cursor.foreground", "114", *options],
                              text=True, stdout=subprocess.PIPE, check=False)
        return proc.stdout.strip() if proc.returncode == 0 else None
    print(f"\n  {paint(header, 'bold')}")
    for n, text in enumerate(options, 1):
        print(f"  {paint(str(n), 'cyan')}) {text}")
    try:
        entered = input("  › ").strip()
    except EOFError:
        return None
    if not entered.isdigit() or not 1 <= int(entered) <= len(options):
        return None
    return options[int(entered) - 1]


def choose_categories(groups: dict[str, list[str]]) -> list[str]:
    options = [f"{category}  ({len(groups[category])} skills)"
               for category in sorted(groups)]
    if GUM:
        proc = subprocess.run(["gum", "choose", "--no-limit", "--header",
                               "Choose categories (space to select, enter to confirm)",
                               "--height", "12", "--selected.foreground", "114",
                               *options], text=True, stdout=subprocess.PIPE, check=False)
        if proc.returncode:
            return []
        return [row.split(" ", 1)[0] for row in proc.stdout.splitlines() if row.strip()]
    print("\n  Categories:")
    for i, opt in enumerate(options, 1):
        print(f"  {i}) {opt}")
    try:
        raw = input("  › Choose numbers (e.g. 1,3): ").replace(",", " ")
    except EOFError:
        return []
    indices = [int(x) for x in raw.split() if x.isdigit()]
    return [options[i - 1].split(" ", 1)[0] for i in indices
            if 1 <= i <= len(options)]


def confirm(message: str, yes: bool) -> bool:
    if yes:
        return True
    if not HAS_TTY:
        line("bad", "Non-interactive writes require --yes (-y).")
        return False
    if GUM:
        return subprocess.run(["gum", "confirm", message], check=False).returncode == 0
    try:
        return input(f"  {message} [y/N] ").lower().strip() in ("y", "yes")
    except EOFError:
        return False


def agents_for(value: str) -> list[str]:
    return list(AGENTS) if value == "both" else [value]


def print_plan(records: list[tuple[str, str, Path, Path]], replace: bool,
               verbose: bool, command: str) -> None:
    counts = {key: 0 for key in ("missing", "linked", "conflict")}
    for state, _, _, _ in records:
        counts[state] += 1
    if command == "install":
        summary = (f"{len(records)} targets: {counts['missing']} to link, "
                   f"{counts['linked']} already linked, {counts['conflict']} conflicts.")
    else:
        summary = (f"{len(records)} targets: {counts['linked']} to remove, "
                   f"{counts['missing']} absent, {counts['conflict']} preserved.")
    line("info", summary)
    for state, agent, dest, src in (records if verbose else records[:10]):
        marker = {"missing": "info", "linked": "ok", "conflict": "warn"}[state]
        line(marker, f"{agent:8} {dest.name:34} {state}")
    if not verbose and len(records) > 10:
        line("skip", f"+ {len(records) - 10} more (use --verbose to show all)")
    if counts["conflict"] and command == "install":
        if replace:
            line("warn", "Conflicts will be BACKED UP before replacement.")
        else:
            line("warn", "Conflicts stay untouched. Use --replace to back them up.")


def records_for(names: list[str], agents: list[str], entries: dict[str, Path]):
    records = []
    for agent in agents:
        for name in names:
            src = source_for(name, agent, entries)
            dest = destination_for(name, agent)
            records.append((state_for(dest, src), agent, dest, src))
    return records


def mutate(command: str, names: list[str], agents: list[str],
           args: argparse.Namespace, entries: dict[str, Path]) -> int:
    heading(command.upper(), f"{len(names)} selected skills · {', '.join(agents)}")
    records = records_for(names, agents, entries)
    print_plan(records, args.replace and command == "install", args.verbose, command)
    if not names:
        line("warn", "No skills selected.")
        return 2
    if args.dry_run:
        line("ok", "Dry run completed. No files changed.")
        return 0

    if command == "install":
        changes = [r for r in records if r[0] == "missing" or
                   (r[0] == "conflict" and args.replace)]
    else:
        changes = [r for r in records if r[0] == "linked"]
    if not changes:
        if command == "install" and any(r[0] == "conflict" for r in records):
            line("warn", "No changes made. Conflicting entries were preserved.")
            return 2
        line("ok", "Nothing to change.")
        return 0
    if not confirm(f"{command.title()} {len(changes)} links?", args.yes):
        line("skip", "Cancelled. No changes made.")
        return 1

    done = 0
    backup_dir: Path | None = None
    failed = 0
    for state, agent, dest, src in changes:
        try:
            if command == "remove":
                # Resolve again immediately before modifying the entry.
                if state_for(dest, src) != "linked" or not dest.is_symlink():
                    line("warn", f"Skipped changed target: {dest}")
                    failed += 1
                    continue
                dest.unlink()
                done += 1
                if args.verbose:
                    line("ok", f"Removed {agent}/{dest.name}")
                continue
            if state == "conflict":
                if backup_dir is None:
                    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
                    backup_dir = STATE_DIR / "backups" / f"{stamp}-{os.getpid()}"
                    backup_dir.mkdir(mode=0o700, parents=True, exist_ok=False)
                old_file = backup_dir / agent / dest.name
                old_file.parent.mkdir(parents=True, exist_ok=True)
                # Rename rather than deleting any real file, directory or link.
                shutil.move(str(dest), str(old_file))
            else:
                old_file = None
            try:
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.symlink_to(src, target_is_directory=True)
            except OSError:
                if old_file is not None and path_exists(old_file):
                    shutil.move(str(old_file), str(dest))
                raise
            done += 1
            if args.verbose:
                line("ok", f"Linked {agent}/{dest.name}")
        except (OSError, shutil.Error) as exc:
            failed += 1
            line("bad", f"{agent}/{dest.name}: {exc}")

    line("ok", f"{done} {('links created' if command == 'install' else 'links removed')}.")
    if backup_dir:
        line("info", f"Previous entries backed up to: {backup_dir}")
    if command == "install":
        line("info", "Restart the agent to reload skill discovery.")
    remaining = len([r for r in records if r[0] == "conflict" and not args.replace])
    if remaining:
        line("warn", f"{remaining} conflicting entries were preserved.")
    return 2 if failed or remaining else 0


def show_list(entries: dict[str, Path], groups: dict[str, list[str]],
              duplicates: list[str], full: bool) -> None:
    heading("CATALOG", f"{len(entries)} unique skills · {len(groups)} collections")
    for category in sorted(groups):
        line("info", f"{category:14} {len(groups[category]):3} skills")
        if full:
            for name in groups[category]:
                print(f"       {name}")
    line("skip", f"{len(duplicates)} vendor-internal aliases deduplicated: {', '.join(duplicates)}")
    print("\n  Profiles:", ", ".join(p for p in PROFILE_LABELS if p != "custom"))


def show_status(entries: dict[str, Path], verbose: bool, check: bool) -> int:
    heading("DOCTOR" if check else "STATUS",
            "Checks link targets; never touches your files.")
    problems = 0
    for agent in AGENTS:
        directory = OPENCODE_DIR if agent == "opencode" else CODEX_DIR
        linked, missing, conflicts = [], [], []
        for name in entries:
            state = state_for(directory / name, source_for(name, agent, entries))
            if state == "linked":
                linked.append(name)
            elif state == "missing":
                missing.append(name)
            else:
                conflicts.append(name)
        line("ok" if not conflicts else "warn",
             f"{agent:8} {len(linked)} linked · {len(missing)} not installed · "
             f"{len(conflicts)} conflicts")
        if conflicts:
            problems += len(conflicts)
            for name in (conflicts if verbose else conflicts[:6]):
                line("warn", f"{directory / name} is not owned by this checkout")
            if not verbose and len(conflicts) > 6:
                line("skip", f"... and {len(conflicts) - 6} more")
        if check and directory.is_dir():
            broken = []
            for item in directory.iterdir():
                if item.is_symlink() and not item.exists():
                    try:
                        points_to_repo = str(ROOT) in os.readlink(item)
                    except OSError:
                        points_to_repo = False
                    if points_to_repo:
                        broken.append(item)
            for item in broken:
                line("bad", f"Broken CamSkills link: {item}")
            problems += len(broken)
    if not problems:
        line("ok", "No conflicting or broken CamSkills links found.")
    return 2 if check and problems else 0


def guided_action(cmd: str, args: argparse.Namespace,
                  entries: dict[str, Path], groups: dict[str, list[str]]) -> int:
    profile_label = choice("Choose a collection", list(PROFILE_LABELS.values()))
    if profile_label is None:
        return 0
    profile = next(k for k, v in PROFILE_LABELS.items() if v == profile_label)
    cats = choose_categories(groups) if profile == "custom" else []
    if profile == "custom" and not cats:
        line("skip", "No categories selected.")
        return 0
    agent_label = choice("Where should skills be linked?",
                         ["Codex + OpenCode", "Codex only", "OpenCode only"])
    if agent_label is None:
        return 0
    agents = {
        "Codex + OpenCode": ["codex", "opencode"],
        "Codex only": ["codex"], "OpenCode only": ["opencode"],
    }[agent_label]
    names = selected_skills(args, entries, groups,
                            profile=None if profile == "custom" else profile,
                            categories=cats)
    return mutate(cmd, names, agents, args, entries)


def run_interactive(args: argparse.Namespace, entries: dict[str, Path],
                    groups: dict[str, list[str]], duplicates: list[str]) -> int:
    if not HAS_TTY:
        print("Run './setup install --profile core --agent both --yes' for unattended setup.")
        print("Run './setup --help' for all commands.")
        return 0
    while True:
        heading("AGENT SKILL MANAGER", f"{len(entries)} skills  /  Codex + OpenCode  /  no sudo")
        options = ["Install / Sync", "Browse catalog", "Doctor / Status",
                   "Remove installed skills", "Help", "Exit"]
        result = choice("What would you like to do?", options)
        if result is None or result == "Exit":
            return 0
        if result == "Browse catalog":
            show_list(entries, groups, duplicates, full=False)
        elif result == "Doctor / Status":
            show_status(entries, args.verbose, check=True)
        elif result == "Help":
            show_help()
        else:
            cmd = "remove" if result == "Remove installed skills" else "install"
            guided_action(cmd, args, entries, groups)
        input("\n  Press Enter to continue...")


def show_help() -> None:
    heading("COMMANDS", "No sudo, no package installation, no surprise overwrites.")
    print("""  ./setup                       Interactive installer (gum if available)
  ./setup install               Select a profile and target agent
  ./setup install -y            Install Essentials for both agents
  ./setup install --profile web --agent codex
  ./setup install --category mobile --agent opencode
  ./setup install --skill cam-route --skill impeccable
  ./setup install --profile all --dry-run
  ./setup install --profile all --replace -y
  ./setup list [--full]          Browse every skill and category
  ./setup status                 Report installed and conflicting links
  ./setup doctor                 Diagnose conflicts and broken links
  ./setup remove --profile core --agent both -y

  Flags: --profile, --category, --skill, --agent, --yes/-y,
         --dry-run, --replace, --verbose, --full

  --replace: move conflicting files to XDG_STATE_HOME/camskills/backups/
  --dry-run: print the plan without changing the filesystem.

  Custom locations:
    CAMSKILLS_OPENCODE_DIR   OpenCode skills folder
    CAMSKILLS_CODEX_DIR      Codex shared skills folder
    XDG_STATE_HOME          Backup state parent
""")


def main() -> int:
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("command", nargs="?", default="menu",
                        choices=["menu", "install", "remove", "list", "status", "doctor", "help"])
    parser.add_argument("--profile", choices=[x for x in PROFILE_LABELS if x != "custom"])
    parser.add_argument("--category", action="append")
    parser.add_argument("--skill", action="append")
    parser.add_argument("--agent", choices=[*AGENTS, "both"], default="both")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--replace", action="store_true")
    parser.add_argument("--verbose", action="store_true")
    parser.add_argument("--full", action="store_true")
    parser.add_argument("-y", "--yes", action="store_true")
    parser.add_argument("-h", "--help", action="store_true")
    args = parser.parse_args()
    if args.help or args.command == "help":
        show_help()
        return 0
    try:
        entries, groups, duplicates = catalog()
        if args.command == "menu":
            return run_interactive(args, entries, groups, duplicates)
        if args.command == "list":
            show_list(entries, groups, duplicates, full=args.full)
            return 0
        if args.command in ("status", "doctor"):
            return show_status(entries, args.verbose, check=args.command == "doctor")
        if args.command == "remove" and args.replace:
            raise ValueError("--replace applies only to install")
        if (HAS_TTY and not args.yes and not args.dry_run and not args.profile
                and not args.category and not args.skill):
            return guided_action(args.command, args, entries, groups)
        names = selected_skills(args, entries, groups)
        return mutate(args.command, names, agents_for(args.agent), args, entries)
    except (ValueError, OSError) as exc:
        line("bad", str(exc))
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
