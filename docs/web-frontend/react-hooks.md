# React Hooks Guidelines

> Reference: [You Might Not Need an Effect - React](https://react.dev/learn/you-might-not-need-an-effect)

## Core Principle

`useEffect` is an escape hatch for syncing with external systems. If no external system is involved, avoid `useEffect`.

## Cases Where `useEffect` Is Usually Unnecessary

### 1. Derived Values from Props or State

```tsx
// Bad: redundant state
const [fullName, setFullName] = useState("");
useEffect(() => {
  setFullName(firstName + " " + lastName);
}, [firstName, lastName]);

// Good: derive during render
const fullName = firstName + " " + lastName;
```

### 2. Caching Expensive Computation

```tsx
// Bad: update derived state in effect
const [visibleTodos, setVisibleTodos] = useState([]);
useEffect(() => {
  setVisibleTodos(getFilteredTodos(todos, filter));
}, [todos, filter]);

// Good: useMemo
const visibleTodos = useMemo(
  () => getFilteredTodos(todos, filter),
  [todos, filter],
);
```

### 3. Resetting All State on Prop Change

```tsx
// Bad: reset with effect
useEffect(() => {
  setComment("");
}, [userId]);

// Good: reset subtree with key
<Profile userId={userId} key={userId} />
```

### 4. Adjusting Partial State on Prop Change

```tsx
// Bad: introduces extra render passes
useEffect(() => {
  setSelection(null);
}, [items]);

// Good: compute during render
const selection = items.find((item) => item.id === selectedId) ?? null;
```

### 5. Sharing Logic Between Event Handlers

```tsx
// Bad: event-specific logic in effect
useEffect(() => {
  if (product.isInCart) {
    showNotification(`Added ${product.name}`);
  }
}, [product]);

// Good: keep in event handler
function handleBuyClick() {
  addToCart(product);
  showNotification(`Added ${product.name}`);
}
```

### 6. Sending POST Requests

```tsx
// Bad: event logic in effect
const [jsonToSubmit, setJsonToSubmit] = useState(null);
useEffect(() => {
  if (jsonToSubmit !== null) {
    post("/api/register", jsonToSubmit);
  }
}, [jsonToSubmit]);

// Good: call directly in event handler
function handleSubmit(e) {
  e.preventDefault();
  post("/api/register", { firstName, lastName });
}
```

Decision rule:
- "The component appeared" -> `useEffect`
- "The user did something" -> event handler

### 7. Chained Effects

```tsx
// Bad: one effect triggers another
useEffect(() => {
  if (card?.gold) {
    setGoldCardCount((c) => c + 1);
  }
}, [card]);

useEffect(() => {
  if (goldCardCount > 3) {
    setRound((r) => r + 1);
    setGoldCardCount(0);
  }
}, [goldCardCount]);

// Good: compute and update in one handler
function handlePlaceCard(nextCard) {
  setCard(nextCard);
  if (nextCard.gold) {
    if (goldCardCount < 3) {
      setGoldCardCount(goldCardCount + 1);
    } else {
      setGoldCardCount(0);
      setRound(round + 1);
    }
  }
}
```

### 8. App Initialization

```tsx
// Bad: runs twice in development Strict Mode
useEffect(() => {
  loadDataFromLocalStorage();
  checkAuthToken();
}, []);

// Good: gate with module-level flag
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      loadDataFromLocalStorage();
    }
  }, []);
}

// Better: run at module init when possible
if (typeof window !== "undefined") {
  checkAuthToken();
}
```

### 9. Notifying Parent State Changes

```tsx
// Bad: notify parent via effect
useEffect(() => {
  onChange(isOn);
}, [isOn, onChange]);

// Good: update both in one event
function handleClick() {
  const nextIsOn = !isOn;
  setIsOn(nextIsOn);
  onChange(nextIsOn);
}

// Better: lift state up
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }
}
```

### 10. Passing Data to Parent

```tsx
// Bad: child fetches then pushes up
function Child({ onFetched }) {
  const data = useSomeAPI();
  useEffect(() => {
    if (data) onFetched(data);
  }, [data, onFetched]);
}

// Good: parent fetches and passes down
function Parent() {
  const data = useSomeAPI();
  return <Child data={data} />;
}
```

### 11. Subscribing to External Stores

```tsx
// Bad: manual subscription lifecycle
useEffect(() => {
  const updateState = () => setIsOnline(navigator.onLine);
  window.addEventListener("online", updateState);
  return () => window.removeEventListener("online", updateState);
}, []);

// Good: useSyncExternalStore
function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
}
```

### 12. Data Fetching

```tsx
// Bad: race condition risk
useEffect(() => {
  fetchResults(query).then(setResults);
}, [query]);

// Good: ignore stale response in cleanup
useEffect(() => {
  let ignore = false;
  fetchResults(query).then((json) => {
    if (!ignore) setResults(json);
  });
  return () => {
    ignore = true;
  };
}, [query]);

// Better: extract to custom hook or use React Query / SWR
```

## Cases Where `useEffect` Is Appropriate

| Case | Example |
|------|---------|
| Sync with external system | WebSocket, browser APIs |
| Timer | `setInterval`, `setTimeout` |
| Event listeners | resize, scroll, keyboard |
| DOM side effects | focus management, measurement |
| Analytics | pageview logging |

## Patterns Used in This Project

### State Consolidation with Discriminated Unions

```tsx
type SessionPhase =
  | { type: "idle" }
  | { type: "starting" }
  | { type: "active"; session: Session }
  | { type: "error"; message: string };

const [phase, setPhase] = useState<SessionPhase>({ type: "idle" });
```

### Optimistic Updates

```tsx
const [optimisticTurns, setOptimisticTurns] = useState<Turn[]>([]);

const turns = useMemo(() => {
  if (!session) return optimisticTurns;
  const serverIds = new Set(session.turns.map((t) => t.id));
  const pending = optimisticTurns.filter((t) => !serverIds.has(t.id));
  return [...session.turns, ...pending];
}, [session, optimisticTurns]);
```

### Explicit Initialization Control

```tsx
// Hook: expose explicit initializer
export const useTaskSession = () => {
  const startSession = useCallback(async () => {
    /* ... */
  }, []);
  return { startSession };
};

// Container: call only when all conditions are met
const hasStartedRef = useRef(false);
useEffect(() => {
  if (isReady && !hasStartedRef.current) {
    hasStartedRef.current = true;
    void startSession();
  }
}, [isReady, startSession]);
```

### Unmount Guard in Async Flows

```tsx
useEffect(() => {
  let isMounted = true;

  const loadData = async () => {
    const result = await fetchData();
    if (!isMounted) return;
    setData(result);
  };

  void loadData();

  return () => {
    isMounted = false;
  };
}, []);
```

### Sequence Tracking to Avoid Races

```tsx
const sessionSeqRef = useRef(0);

useEffect(() => {
  sessionSeqRef.current += 1;
  const currentSeq = sessionSeqRef.current;

  const isCurrentSession = () => sessionSeqRef.current === currentSeq;

  const startSession = async () => {
    const result = await connectToExternalSystem();
    if (!isCurrentSession()) return;
    handleResult(result);
  };

  void startSession();
}, [dependency]);
```

## Data Fetching Best Practices

### Preferred: Dedicated Data Library

```tsx
import { useQuery } from "@tanstack/react-query";

function useTaskData(taskId: string) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchTaskData(taskId),
  });
}
```

Benefits:
- Caching, deduplication, background refresh
- Built-in retry and error handling
- Better SSR/SSG support

### Acceptable Fallback: Fetch in Effect

```tsx
useEffect(() => {
  let ignore = false;

  const fetchData = async () => {
    setLoading(true);
    const result = await api.fetch();
    if (ignore) return;

    if (result.err) {
      setError(result.err.message);
    } else {
      setData(result.val);
    }
    setLoading(false);
  };

  void fetchData();

  return () => {
    ignore = true;
  };
}, [query]);
```

## React 19 Features

### `use` (Server Components)

```tsx
import { use } from "react";

function Comments({ commentsPromise }) {
  const comments = use(commentsPromise);
  return comments.map((c) => <Comment key={c.id} comment={c} />);
}
```

### `useOptimistic`

```tsx
import { useOptimistic } from "react";

function TodoList({ todos, addTodo }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, { ...newTodo, pending: true }],
  );

  async function handleAdd(formData) {
    const newTodo = { text: formData.get("text") };
    addOptimisticTodo(newTodo);
    await addTodo(newTodo);
  }

  return optimisticTodos.map((todo) => <Todo key={todo.id} todo={todo} />);
}
```

### `useActionState`

```tsx
import { useActionState } from "react";

function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      const result = await login(formData);
      if (result.err) return { error: result.err.message };
      return { success: true };
    },
    null,
  );

  return (
    <form action={formAction}>
      <input name="email" type="email" />
      <button disabled={isPending}>Log in</button>
      {state?.error && <p>{state.error}</p>}
    </form>
  );
}
```

## `useSyncExternalStore`

Use this for subscribing to external stores (browser APIs, third-party state containers).

```tsx
import { useSyncExternalStore } from "react";

function useOnlineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("online", callback);
      window.addEventListener("offline", callback);
      return () => {
        window.removeEventListener("online", callback);
        window.removeEventListener("offline", callback);
      };
    },
    () => navigator.onLine,
    () => true,
  );
}

function useExternalStore<T>(store: ExternalStore<T>) {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}
```

Why this is better than `useEffect` subscriptions:
- Correct behavior in concurrent rendering
- Better SSR support
- Prevents UI tearing between render phases
