# Corrections by Language

Apply these when creating or updating notes. Fix the user's code to follow current best practices while preserving their original intent.

## JavaScript / React

| Before | After | Why |
|---|---|---|
| `var x = 1` | `let x = 1` / `const x = 1` | `var` is function-scoped and hoisted; `let`/`const` are block-scoped |
| `function MyComponent() { ... }` | `const MyComponent = () => { ... }` | Arrow functions don't rebind `this` |
| `useState()` without destructuring | `const [state, setState] = useState()` | Destructuring is the standard convention |
| `import * as X from 'y'` | `import { specificThing } from 'y'` | Named imports enable tree-shaking |
| `class MyComponent extends React.Component` | `function MyComponent() { ... }` | Functional components + hooks are the modern standard |
| `componentDidMount() { ... }` | `useEffect(() => { ... }, [])` | Hooks compose better than lifecycle methods |
| `this.state.x` / `this.setState(...)` | `useState` / `useReducer` | Hooks, not classes |
| Props without destructuring | `function Comp({ prop1, prop2 })` | Destructuring makes props visible at a glance |

## TypeScript

| Before | After | Why |
|---|---|---|
| `any` | Specific type or `unknown` | `any` disables type checking |
| `interface` for unions | `type` | `type` supports union/intersection; `interface` is for object shapes |
| `String` (capital) | `string` (lowercase) | Capital is the wrapper type, lowercase is the primitive |
| `const x: MyType = y as MyType` | `const x: MyType = y` | Type annotation casts are safer than `as` |
| Optional chaining with `&&` | `?.` | Optional chaining is cleaner and type-safe |

## React Native

| Before | After | Why |
|---|---|---|
| `<Image source={{uri: x}} />` | `<Image source={{uri: x}} />` from `expo-image` | expo-image adds caching and blurhash |
| `FlatList` | `FlashList` from `@shopify/flash-list` | FlashList is 5-10x faster |
| `ScrollView` + `.map()` | `FlashList` or `FlatList` | Virtualized lists don't render off-screen items |
| `AsyncStorage` | `react-native-mmkv` | MMKV is 10-100x faster, synchronous reads |
| `StyleSheet.create({})` with hardcoded values | Use token system (`Spacing.md`, `Colors.primary`) | Tokens enforce consistency |

## Python

| Before | After | Why |
|---|---|---|
| `print('debug')` for debugging | `import logging; logging.debug(...)` | Logging has levels and can be toggled |
| `except:` bare | `except SpecificException:` | Bare except catches `KeyboardInterrupt`, `SystemExit` |
| `open(f)` without `with` | `with open(f) as file:` | Context manager guarantees cleanup |
| `== None` or `== True` | `is None` / `is True` | `is` checks identity, `==` checks equality |
| Mutable default args: `def f(x=[])` | `def f(x=None): x = x or []` | Mutable defaults are shared across calls |

## SQL

| Before | After | Why |
|---|---|---|
| `SELECT *` | `SELECT col1, col2` | Explicit columns are self-documenting and faster |
| `WHERE name = ${userInput}` | Parameterized query or ORM | SQL injection prevention |
| No index on `WHERE` columns | Add index | Full table scans on large tables |
| `JOIN` without `ON` | `JOIN ... ON ...` | Cross joins are rarely intentional |
