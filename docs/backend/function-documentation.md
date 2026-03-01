# Function Documentation Conventions

## Overview

Public functions in Domain and UseCase layers must have their specifications documented using JSDoc.
This improves the accuracy of code generation, test generation, and code reviews.

By explicitly stating pre-conditions and post-conditions, designing boundary value tests becomes easier.

## Required Tags

### Domain Functions

| Tag | Description | Required |
|------|------|------|
| `@param` | Meaning and constraints of arguments | Yes |
| `@returns` | Meaning of the return value | Yes |
| `@precondition` | Conditions that must hold before invocation | Yes |
| `@postcondition` | Conditions guaranteed after invocation | Yes |

### UseCase Functions

In addition to the Domain function tags, the following is also required.

| Tag | Description | Required |
|------|------|------|
| `@idempotent` | Whether the operation is idempotent and the reason | Yes |

## Code Examples

### Domain Functions

```typescript
/**
 * Transitions an item to the archived state.
 *
 * @param item - The item to archive
 * @returns The archived item
 * @precondition item.status === "active"
 * @postcondition return.status === "archived" && return.archivedAt !== undefined
 */
export const archive = (item: Item): Item => ({
  ...item,
  status: "archived",
  archivedAt: new Date(),
});
```

```typescript
/**
 * Updates the item name.
 *
 * @param item - The item to update
 * @param name - The new name (1 to 100 characters)
 * @returns The item with the updated name
 * @precondition name.length >= 1 && name.length <= 100
 * @postcondition return.name === name && return.updatedAt > item.updatedAt
 */
export const updateName = (item: Item, name: string): Item => ({
  ...item,
  name,
  updatedAt: new Date(),
});
```

### UseCase Functions

```typescript
/**
 * Creates a new item.
 *
 * @param input - Creation parameters
 * @returns The created item
 * @precondition input.name.length >= 1
 * @postcondition One item is added to the DB
 * @idempotent false - Calling multiple times with the same input creates duplicates
 */
export const create = async (input: CreateItemInput): Promise<Result<Item, AppError>> => {
  // ...
};
```

```typescript
/**
 * Updates the status of an item.
 *
 * @param input - Item ID and new status
 * @returns The updated item
 * @precondition An item with the specified ID exists
 * @postcondition The item's status is changed to input.status
 * @idempotent true - Calling multiple times with the same input produces the same result
 */
export const updateStatus = async (input: UpdateStatusInput): Promise<Result<Item, AppError>> => {
  // ...
};
```

## Relationship with Tests

JSDoc pre-conditions and post-conditions are directly linked to test design.

| JSDoc | Role in Tests |
|-------|--------------|
| `@precondition` | Preconditions for test cases. Violation cases should also be added as boundary value tests |
| `@postcondition` | Basis for assertions. Verified in test expect statements |
| `@idempotent` | If idempotent, test with two executions of the same input; if not idempotent, verify duplication prevention |

### Example of Reflecting in Tests

```typescript
describe("Item.archive", () => {
  const cases = [
    {
      name: "can archive an active item",
      input: { ...baseItem, status: "active" as const },
      expected: { status: "archived" },
    },
  ];

  it.each(cases)("$name", ({ input, expected }) => {
    const result = Item.archive(input);
    expect(result.status).toBe(expected.status);
    expect(result.archivedAt).toBeDefined(); // @postcondition
  });

  it("violates precondition for non-active items", () => {
    // Test for @precondition violation
    const draftItem = { ...baseItem, status: "draft" as const };
    expect(() => Item.archive(draftItem)).toThrow();
  });
});
```

## Related Documents

- [Server Architecture](./server-architecture.md) - Overall layer structure
- [UseCase Implementation Rules](./usecase-rules.md) - Implementation principles for the UseCase layer
- [Domain Model](./domain-modeling.md) - Design policies for the Domain layer
- [Unit Testing](../testing/unit-testing.md) - Table-driven testing implementation policies
