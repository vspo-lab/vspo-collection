# Domain Model

## Overview

This document defines the design policies and structure for domain modeling. Application-specific domain models should be implemented following these policies.

## File Structure

Domain models are divided into directories by aggregate, with a clear separation between each aggregate's root entity and value objects.

```
services/transcriptor/src/domain/
└── [your-domain]/           # Application-specific aggregates
    ├── [aggregate-root].ts  # Aggregate root
    ├── [value-object].ts    # Value objects
    ├── [entity].ts          # Child entities
    └── index.ts             # Barrel file
```

## Domain Model Design Policy

### 1. Zod Schema First

All type definitions are derived from Zod schemas:

```typescript
// item.ts
export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["active", "inactive"]),
  createdAt: z.date(),
});
export type Item = z.infer<typeof itemSchema>;
```

### 2. Domain Methods Use the Companion Object Pattern

Each domain model has factory methods and business logic in a companion object with the same name.
Public functions should have JSDoc with pre-conditions and post-conditions. See [Function Documentation Conventions](./function-documentation.md) for details.

```typescript
// item.ts
export const Item = {
  new: (props: CreateItemProps): Item => { ... },
  update: (item: Item, props: UpdateProps): Item => { ... },
  activate: (item: Item): Item => { ... },
  deactivate: (item: Item): Item => { ... },
} as const;
```

### 3. Type Guards and Utilities

When using Discriminated Unions, also provide type guard functions:

```typescript
// item-detail.ts (Discriminated Union example)
export const ItemDetail = {
  isTypeA: (detail: ItemDetail): detail is TypeADetail =>
    detail.type === "type_a",
  isTypeB: (detail: ItemDetail): detail is TypeBDetail =>
    detail.type === "type_b",
  default: (): DefaultDetail => ({ type: "default" }),
} as const;
```

### 4. Immutable Updates

All update operations return new objects:

```typescript
const updatedItem = Item.update(item, { name: "New Name" });
const activatedItem = Item.activate(item);
```

## Repository Design Policy

### 1. Using drizzle-zod Schemas as DTOs

In the repository layer, Drizzle-generated `select*Schema` are used as DTOs to minimize manual mapping:

```typescript
import {
  type SelectItem,
  type SelectItemDetail,
  itemsTable,
  selectItemDetailsSchema,  // drizzle-zod schema
  itemDetailsTable,
} from "./mysql/schema";

// Helper to convert DB item + details to domain aggregate
const toItemAggregate = (
  item: SelectItem,
  details: SelectItemDetail[],
): Item => ({
  id: item.id,
  name: item.name,
  // ... direct mapping
  // Use drizzle-zod schema as DTO for child entities
  details: details.map((row) => selectItemDetailsSchema.parse(row)),
});

// For simple entities, use schema directly
return Ok(selectItemsSchema.parse(result.val[0]));
```

### 2. Simple Mapping

Helper functions that convert DB rows to domain models should be kept simple:

```typescript
// Good: Simple mapping
const toItemAggregate = (
  item: SelectItem,
  details: SelectItemDetail[],
): Item => ({
  id: item.id,
  name: item.name,
  // ... direct mapping
  details: details.map(toItemDetail),
});

// Bad: Verbose expansion
const items = itemsResult.val.map((item) => ({
  id: item.id,
  name: item.name,
  // ... listing the same fields every time
}));
```

### 3. N+1 Problem Prevention

When fetching aggregate child entities, use `inArray` to fetch them in bulk:

```typescript
// Good: Bulk fetch
const itemIds = items.map((i) => i.id);
const detailsResult = await tx
  .select()
  .from(itemDetailsTable)
  .where(inArray(itemDetailsTable.itemId, itemIds));

// Group by itemId
const detailsByItemId = new Map<string, SelectItemDetail[]>();
for (const detail of detailsResult) {
  const existing = detailsByItemId.get(detail.itemId) ?? [];
  existing.push(detail);
  detailsByItemId.set(detail.itemId, existing);
}

// Bad: N+1 queries
for (const item of items) {
  const details = await tx
    .select()
    .from(itemDetailsTable)
    .where(eq(itemDetailsTable.itemId, item.id));
}
```

### 4. Domain Model and DB Model Alignment

Avoid excessive normalization and keep domain models aligned with DB models as much as possible:

```typescript
// Good: Flat structure matching the DB
const itemMetricsSchema = z.object({
  id: z.string(),
  itemId: z.string(),
  metric1: z.number(),
  metric2: z.number(),
  metric3: z.number(),
  // ...
});

// Bad: Unnecessary normalization (converting to an array)
const itemMetricsSchema = z.object({
  metrics: z.array(
    z.object({
      type: z.string(),
      value: z.number(),
    })
  ),
});
```

When backward compatibility for the API is needed, perform the conversion in the DTO layer.

## Naming Conventions

### Database
- Table names: Plural snake_case (`users`, `items`, `orders`)
- Column names: snake_case (`user_id`, `created_at`, `item_id`)
- Foreign keys: `{referenced_table_singular}_id` (`user_id`, `item_id`, `order_id`)

### Application
- Domain models: PascalCase (`User`, `Item`, `Order`)
- Type definitions: PascalCase (`ItemStatus`, `OrderType`)
- Type aliases (for export): `{Model}Type` (`UserType`, `ItemType`)
- Variables/Properties: camelCase (`itemId`, `createdAt`)
- Repositories: `{Model}Repository` (`ItemRepository`)
- UseCases: `{Model}UseCase` (`ItemUseCase`)

## Data Storage Policy

- **Per-user storage**: All data is stored associated with a User
- **Transaction management**: Operations spanning multiple repositories are managed with transactions at the UseCase layer
- **Error handling with Result type**: All errors are handled uniformly using the Result type
- **Per-aggregate updates**: Each aggregate is managed independently through its repository and UseCase, and is saved per aggregate unit

## Aggregate Boundaries

Each aggregate is managed with an independent UseCase and Repository.

### [YourAggregate] (Example)
- **Root Entity**: [AggregateRoot]
- **Value Objects**: [ValueObject1], [ValueObject2]
- **Child Entities**: [ChildEntity]
- **Files**: `domain/[your-domain]/`
- **UseCase**: `[YourAggregate]UseCase`
- **Repository**: `[YourAggregate]Repository`
- **Operations**: Create, Update, Get, Delete
- **Key Methods**:
  - `[AggregateRoot].new()` - Create
  - `[AggregateRoot].update()` - Update
  - `[AggregateRoot].[businessMethod]()` - Business logic

## Use Case Diagram (Example)

```mermaid
flowchart LR
  C[User]
  UC1([Login])
  UC2([Item List])
  UC3([Create Item])
  UC4([Edit Item])
  UC5([Delete Item])

  C --> UC1 --> UC2
  UC2 --> UC3
  UC2 --> UC4
  UC2 --> UC5
```

## Class Diagram (Example)

```mermaid
classDiagram
direction LR

class Item {
  +string id
  +string name
  +ItemStatus status
  +ItemDetail[] details
  +DateTime createdAt
  +DateTime updatedAt
  +new(props) Item
  +update(item, props) Item
  +activate(item) Item
  +deactivate(item) Item
}

class ItemDetail {
  +string id
  +string itemId
  +DetailType type
  +string content
  +DateTime createdAt
  +new(props) ItemDetail
  +isTypeA(detail) boolean
  +isTypeB(detail) boolean
}

Item "1" --> "*" ItemDetail : contains
```

## ER Diagram (Example)

```mermaid
erDiagram
    user ||--o{ account : has
    user ||--o{ session : has
    user ||--o{ verification : has
    user ||--o{ your_table : owns

    user {
        varchar id PK
        varchar email UK
        varchar name
        boolean emailVerified
        varchar image
        datetime createdAt
        datetime updatedAt
    }

    account {
        varchar id PK
        varchar userId FK
        varchar accountId
        varchar providerId
        varchar accessToken
        varchar refreshToken
    }

    session {
        varchar id PK
        varchar userId FK
        datetime expiresAt
        varchar token
        varchar ipAddress
        varchar userAgent
    }

    verification {
        varchar id PK
        varchar identifier
        varchar value
        datetime expiresAt
    }

    your_table {
        varchar id PK
        varchar user_id FK
        varchar name
        enum status
        datetime created_at
        datetime updated_at
    }
```

## Enums (Examples)

### ItemStatus
- `active` - Active
- `inactive` - Inactive
- `archived` - Archived

### DetailType
- `type_a` - Type A
- `type_b` - Type B
- `default` - Default

## API Endpoints (Examples)

### Item API
- `GET /items` - Get item list
  - Response: `{ items: [{ id, name, status, createdAt, ... }] }`
- `POST /items` - Create item
  - Request: `{ name, status? }`
  - Response: `{ id, name, status, createdAt, updatedAt }`
- `GET /items/{itemId}` - Get item
  - Response: `{ id, name, status, details, createdAt, updatedAt }`
- `PUT /items/{itemId}` - Update item
  - Request: `{ name?, status? }`
- `DELETE /items/{itemId}` - Delete item
