# TypeScript Type System Usage Instructions

## Core Guidelines
1. Use Zod schemas as the source of truth for type definitions
2. Infer types from schemas instead of writing explicit interfaces
3. Use generics in utilities to keep app code JavaScript-like
4. Ensure types flow via inference, avoiding redundant annotations
5. Restrict 'as' to library boundaries, never in app logic
6. Isolate unavoidable 'as' in utils with comments

## TypeScript Implementation

### Schema-First Development
- Define Zod schemas as the source of truth for data structures
- Infer TypeScript types from schemas using `z.infer<typeof schemaName>`
- When extending schemas, import the base schema and use `z.extend()` or union types
- Use schema composition for complex types

Example:
```typescript
// Base schema (source of truth)
const baseSchema = z.object({
  id: z.string(),
  createdAt: z.date()
});

// Extended schema
const extendedSchema = baseSchema.extend({
  additionalField: z.boolean()
});

// Inferred types
type Base = z.infer<typeof baseSchema>;
type Extended = z.infer<typeof extendedSchema>;
```

### Type Safety
- Enable `strict` in `tsconfig.json` for maximum type safety
- Leverage `Partial`, `Pick`, `Omit` for schema/type variations
- Use mapped types for dynamic transformations in libraries
- Isolate `as` to utils, never in app logic
- Use control flow analysis with early returns for type narrowing
- **Use `satisfies` for object literal type checking** (see below)

### `satisfies` Operator for Object Literals

Always use `satisfies` instead of type annotations (`: Type`) when defining object literals. This prevents type widening while maintaining compile-time type checking.

**Why `satisfies`?**
1. Validates object shape at compile time (catches missing/extra properties)
2. Preserves literal types (e.g., `"candidate"` stays as `"candidate"`, not widened to `string`)
3. Enables exhaustiveness checking for discriminated unions
4. Prevents API response transformation bugs where fields are accidentally omitted

**Pattern: Use `satisfies` instead of type annotation**

```typescript
// ❌ BAD: Type annotation widens literal types
const turn: LiveTranscript = {
  role: "candidate",  // type becomes string, not "candidate"
  text: "Hello"
};

// ✅ GOOD: satisfies preserves literal types
const turn = {
  role: "candidate",  // type is "candidate" (literal)
  text: "Hello"
} satisfies LiveTranscript;
```

**Pattern: Function return with `satisfies`**

```typescript
// ❌ BAD: Missing properties not caught at definition site
function createProfile(): UserProfile {
  return {
    name: "John",
    // oops, forgot 'email' - error appears at call site, not here
  };
}

// ✅ GOOD: satisfies catches errors immediately
function createProfile(): UserProfile {
  return {
    name: "John",
    // error: Property 'email' is missing
  } satisfies UserProfile;
}
```

**Pattern: Discriminated unions**

```typescript
// ✅ GOOD: satisfies ensures literal type is preserved for discrimination
function processResult(success: boolean) {
  if (success) {
    return { isMerged: true, data: result } satisfies MergeResult;
  }
  return { isMerged: false, error: "Failed" } satisfies MergeResult;
}
```

**Pattern: Configuration objects**

```typescript
// ✅ GOOD: Validates config shape while preserving inference
const config = {
  apiEndpoint: "/api/v1",
  timeout: 5000,
  retries: 3,
} satisfies ApiConfig;
```

**When to use `satisfies`:**
- All object literal assignments: `const x = {...} satisfies Type`
- Return statements with object literals: `return {...} satisfies Type`
- Configuration objects and constants
- API response transformations
- Objects with discriminated union types

**When type annotation is still appropriate:**
- Variable declarations without initializer: `let x: Type;`
- Function parameters: `function foo(x: Type)`
- Generic type parameters: `useState<Type>()`

### Schema Patterns
1. **Field Selection Pattern**:
```typescript
// Base schema
const dataSchema = z.object({ /* ... */ });

// Selection schema
const selectionSchema = z.object({
  field1: z.boolean().optional(),
  field2: z.union([z.boolean(), z.array(z.number())]).optional()
});

type Selection = z.infer<typeof selectionSchema>;
```

2. **Metadata Pattern**:
```typescript
const MetadataSchema = z.object({
  total: z.number(),
  results: z.array(z.object({
    status: z.enum(["success", "failed"]),
    data: z.any()
  }))
});

type Metadata = z.infer<typeof MetadataSchema>;
```

### Best Practices
1. Always import base schemas from their source of truth
2. Use schema composition over type composition
3. Leverage Zod's built-in validation
4. Keep validation logic in the schema definition
5. Use discriminated unions for complex state handling

Example of Complex Pattern:
```typescript
// Task result pattern
const TaskResultSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    data: z.any()
  }),
  z.object({
    ok: z.literal(false),
    error: z.object({
      code: z.string(),
      message: z.string()
    })
  })
]);

type TaskResult = z.infer<typeof TaskResultSchema>;
```

