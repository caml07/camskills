# Safe Local Git Workflow

The OSF vault uses local Git as a rollback/history mechanism. The skill may
commit completed note work automatically, but it should behave conservatively.

## Before editing

Run Git status and record every dirty path before making changes.

If the vault is not a Git worktree, complete the note operation but skip the
commit. Do not initialize a repository from this skill unless the user explicitly
asks.

## After editing

Build the exact set of files changed for the current request.

If any of those exact files were already modified/untracked before the request,
do not auto-commit them. This prevents the skill from bundling earlier user work
into its own commit.

Unrelated dirty paths do not block a commit as long as they are not staged.

## Stage narrowly

Stage exact paths only. Never use broad staging such as:

```bash
git add .
git add -A
git commit -a
```

Prefer:

```bash
git add -- '04 My Notes/Research/Terminal thoughts.md'
```

or several explicit paths.

## Validate staged work

At minimum:

```bash
git diff --cached --check
```

Inspect the staged diff to confirm it contains only the intended note/property
changes.

If the `no-commit-secrets` skill/scanner is available, use it on staged files
before committing. If its runtime is unavailable, inspect the staged diff for
obvious credentials and do not knowingly commit secrets.

## Commit message

Use a compact local history message:

```text
notes(osf): capture Terminal theory
notes(osf): rate The Between
notes(osf): finish reading 090
notes(osf): link Monolith research note
```

## Never push implicitly

Automatic note capture may commit locally. It does not imply permission to push,
publish, or synchronize a remote repository. Push only when the user explicitly
asks.
