# Python Debugging

## Common Issues

### Import Errors

```bash
# Check Python version (3.11+ for most modern projects)
python --version

# List installed packages in venv
pip list

# Check if venv is activated
which python

# If import works in terminal but not in editor:
# The editor may be using a different Python interpreter
```

### Virtual Environment Issues

```bash
# Create fresh venv:
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows

# If venv is corrupted:
rm -rf .venv
python -m venv .venv

# Export/install dependencies:
pip freeze > requirements.txt
pip install -r requirements.txt
```

### pip Install Failures

```bash
# Try upgrading pip first:
pip install --upgrade pip

# For native extension failures (psycopg2, Pillow):
# On Mac: xcode-select --install
# On Ubuntu: sudo apt install python3-dev libpq-dev
# On Windows: install Visual C++ Build Tools

# Use --no-cache-dir if cache is corrupted:
pip install --no-cache-dir <package>

# Try binary-only wheel:
pip install --only-binary :all: <package>
```

### Common Runtime Errors

| Error | Likely Cause | Fix |
|---|---|---|
| `ModuleNotFoundError` | Package not installed | `pip install <package>` |
| `AttributeError: module X has no attribute Y` | Wrong import path | Check the actual API (`dir(module)`) |
| `TypeError: ... missing 1 required positional argument` | Calling instance method on class | Use `Class().method()` not `Class.method()` |
| `ValueError: I/O operation on closed file` | Context manager misuse | Use `with open(...) as f:` |
| `RecursionError: maximum recursion depth exceeded` | Infinite recursion missing base case | Add base case or convert to loop |

### .env Not Loading

```bash
# If using python-dotenv:
from dotenv import load_dotenv
load_dotenv()  # Must be called before os.getenv()

# Check .env file location (it reads from CWD, not from module path)
# Pass override=True to override existing env vars

# Or use python-dotenv path=<your-path>
```
