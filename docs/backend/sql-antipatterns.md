# Database and SQL Antipatterns

## Overview

This document summarizes practical antipattern checks for relational databases and SQL. It is based on the following references:

- SQL Antipatterns (2nd edition) structure: 4 categories, 25 antipatterns
- Talk: "Introduction to SQL Antipatterns 2nd Edition" (Developers Summit 2025 Summer)

Use this as a checklist when designing and reviewing code in `services/transcriptor/src/infra/repository/mysql/` and related domain/usecase code.

## 4 Categories

### 1. Logical Database Design

Common antipatterns:

- Jaywalking (storing comma-separated IDs in a single column)
- Naive Trees
- ID Required
- Keyless Entry
- EAV (Entity-Attribute-Value)
- Polymorphic Associations
- Multicolumn Attributes
- Metadata Tribbles

Primary risk: Data integrity breaks down and constraints move from the DB to application code.

### 2. Physical Database Design

Common antipatterns:

- 31 Flavors
- Index Shotgun
- Fear of UNKNOWN
- Ambiguous Groups
- Random Selection

Primary risk: Performance tuning and schema changes rely on guesswork.

### 3. Query Writing

Common antipatterns:

- Spaghetti Query
- Implicit Columns
- Poor Man's Search Engine
- Random Selection
- Pattern Matching Usage

Primary risk: SQL readability, predictability, and optimizer compatibility degrade.

### 4. Application Development

Common antipatterns:

- Blunt Hammer
- Read Committed?
- Fear of UNKNOWN
- Phantom Files
- Two-headed Monster

Primary risk: Transaction boundaries and consistency guarantees break in production.

## Priority Rules for This Template

### 1. Do Not Store ID Lists in a Single Column (Jaywalking)

Bad:

```sql
CREATE TABLE products (
  product_id BIGINT PRIMARY KEY,
  account_ids VARCHAR(255) -- "12,34,56"
);
```

Good:

```sql
CREATE TABLE product_accounts (
  product_id BIGINT NOT NULL,
  account_id BIGINT NOT NULL,
  PRIMARY KEY (product_id, account_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id),
  FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);
```

Reason: Eliminates the need for regex-based JOINs and string-splitting updates, enables index usage, and guarantees integrity through foreign keys.

### 2. Always Define Primary Keys and Foreign Keys (Keyless Entry)

- Every table must have a stable primary key
- All relationships must have explicit foreign keys
- When foreign keys cannot be used (e.g., external boundaries), document the reason in schema comments and docs

### 3. Do Not Adopt EAV Unless You Explicitly Accept the Query and Consistency Tradeoffs

Recommendations:

- Use typed columns for stable attributes
- Use JSON columns only for truly sparse and extensible attributes
- When using JSON, validate at both the schema layer and the domain layer

### 4. Avoid Polymorphic Associations via "type + id" Pairs

Bad:

```sql
owner_type VARCHAR(50), owner_id BIGINT
```

Recommendations:

- Create separate junction tables for each target aggregate
- Or use supertype/subtype tables with FK constraints

### 5. Add Indexes Based on Query Patterns, Not Intuition (Index Shotgun)

- Start from actual `WHERE`, `JOIN`, `ORDER BY` clauses
- Prefer composite indexes that match filter order
- Remove unused or duplicate indexes to reduce write costs

### 6. Handle NULL Semantics Explicitly (Fear of UNKNOWN)

- Determine whether `NULL` represents a valid state for each column
- Do not use sentinel values like `''`, `0`, or `'N/A'` as fake NULLs
- Use `IS NULL` / `IS NOT NULL` checks intentionally in SQL

### 7. Keep SQL Small and Composable (Spaghetti Query)

- Break up large SQL with CTEs or by splitting repository methods
- Focus each query on a single read model / use case
- Prefer clarity over an overly generalized "one SQL to rule them all"

### 8. Do Not Use `SELECT *` in Application Queries (Implicit Columns)

Always specify columns explicitly:

- Prevents unintended payload growth
- Prevents breakage on schema changes
- Enables index-only scans and easier review

### 9. Do Not Use `%keyword%` as a Long-Term Search Strategy (Poor Man's Search Engine)

- `%...%` often prevents index usage
- For full-text search needs, use the DB's full-text search capabilities or an external search engine
- Clarify exact-match / prefix-match requirements in the use case

### 10. Control Cross-Resource Writes Within a Single Transaction Boundary (Two-headed Monster / Phantom Files)

- When DB updates and file/object-storage updates must be atomic:
  - Use an outbox/event pattern, or
  - Use compensating actions with explicit retry semantics
- Do not rely on "they usually succeed in order"

## PR Review Checklist

Use this checklist for schema/query-related PRs:

- [ ] Are comma-separated lists stored in a single column?
- [ ] Are PK/FK missing where relationships exist?
- [ ] Is `SELECT *` used in repository or service queries?
- [ ] Do query conditions align with existing indexes?
- [ ] Are nullable columns being added without clear domain semantics?
- [ ] Is `%keyword%` search being added without a search strategy decision?
- [ ] Are multi-resource writes being done without explicit consistency design?

## References

- Speaker Deck: Introduction to SQL Antipatterns 2nd Edition (published 2025-07-18)
  https://speakerdeck.com/twada/intro-to-sql-antipatterns-2nd
- SQL Antipatterns (2nd edition), Bill Karwin
