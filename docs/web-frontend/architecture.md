## Overview

The frontend architecture follows a feature-based approach, organizing code by domain features rather than technical layers. This structure aligns with Domain-Driven Design (DDD) principles while adapting them for frontend development. Within each feature, we implement the Container/Presentational pattern (Container 1st design) to separate business logic from UI presentation.

This architecture is designed for Next.js App Router, where **features and pages are 1:1 mapped**. Each route in `app/` corresponds to a single feature, keeping routing and feature logic tightly coupled.

## Directory Structure

Directory structure is as follows:

```
app/                          # Next.js App Router (routes & pages)
├── layout.tsx                # Root layout
├── globals.css               # Global styles
├── (public)/                 # Public pages (legal, contact)
├── (auth)/                   # Auth pages (onboarding, phone-verification)
└── (protected)/              # Protected pages (home, etc.)
│
features/                     # Feature modules (business logic)
├── [your-feature]/           # Core feature module
│   ├── api/                  # Feature API module
│   ├── components/
│   │   ├── containers/       # Business logic containers
│   │   └── presenters/       # UI presenters
│   ├── hooks/                # Custom hooks
│   └── types/                # Type definitions
├── home/                     # Dashboard feature
├── history/                  # History feature
├── onboarding/               # User onboarding flow
├── phone-verification/       # Phone/SMS verification
├── settings/                 # User settings
├── pricing/                  # Pricing page
├── plan-select/              # Plan selection
├── contact/                  # Contact form
├── landing/                  # Landing page
└── legal/                    # Legal pages (terms, privacy)
│
shared/                       # Shared code across the app
├── components/               # Shared UI building blocks
│   ├── ui/                   # Base design system (Button, Input, Card, etc.)
│   ├── presenters/           # Reusable presentational components
│   └── containers/           # Shared container components (AppShell, AuthGuard)
├── lib/                      # Shared libs (apiConfig, audio device key)
└── utils/
```

## Container/Presentational Pattern

We adopt the Container 1st approach to separate concerns within components:

### Container Components
- Responsible for "what to do":
  - Data fetching and state management
  - Business logic
  - Event handling
  - Data transformation
- Pass data and callbacks to presentational components
- Don't contain significant markup or styling

### Presentational Components
- Responsible for "how to look":
  - UI rendering
  - Styling
  - Animation
  - Accessibility
- Receive data and callbacks via props
- Typically pure functional components
- Reusable across different containers

### Example

**Container** (`MicCheckPage.tsx`):

```tsx
"use client";

import { fetchMicCheckData } from "../api/micCheckApi";
import { MicCheckPagePresenter } from "../presenters/MicCheckPagePresenter";

export const MicCheckPage = () => {
  // Data fetching + device selection logic lives here.
  return <MicCheckPagePresenter /* props */ />;
};
```

**Presenter** (`MicCheckPagePresenter.tsx`):

```tsx
type Props = {
  checklist: Array<{ title: string; detail: string }>;
};

export const MicCheckPagePresenter = ({ checklist }: Props) => {
  return <section>{/* render checklist */}</section>;
};
```

### Key Points

| Container | Presenter |
|-----------|-----------|
| `useState`, `useEffect` | Props only |
| Business logic (filtering) | Pure rendering |
| Event handler logic | `onClick={onXxx}` |
| Minimal JSX | Rich JSX & styling |

## API Access

- Feature-specific API modules live under `features/<feature>/api/`
- Use `shared/lib/apiConfig.ts` for the base URL
- API functions return `Result` with `@vspo/errors`
- Feature-specific endpoints are defined per module

## Component Organization

Components are organized in three ways:

1. **Page-specific components** (`_components/`): Located within each route, used only in that page. Prefixed with `_` to indicate they are private to the route and excluded from routing.
   ```
   app/feature/
   ├── page.tsx
   └── _components/        # Private to this route (underscore prefix)
       ├── FeatureTimer.tsx
       ├── StatusBadge.tsx
       └── ...
   ```

2. **Feature-specific components**: Located within each feature module, reusable within that feature
   ```
   features/mic-check/components/
   ├── containers/
   │   ├── MicCheckPage.tsx
   │   └── ...
   └── presenters/
       ├── MicCheckPagePresenter.tsx
       └── ...
   ```

3. **Shared components**: Located in `shared/components/`, reused across features
   ```
   shared/components/
   ├── containers/
   │   ├── Modal.tsx
   │   ├── Pagination.tsx
   │   └── ...
   └── presenters/
       ├── Button.tsx
       ├── Card.tsx
       └── ...
   ```

## App Router Structure

In Next.js App Router, features and pages are **1:1 mapped**. Each route corresponds to a single feature.

### Route Structure

```
app/                        # Entry page
├── page.tsx
└── _components/            # Page-specific components (optional)
app/feature/
├── page.tsx                # Feature page
├── loading.tsx             # Loading UI (optional)
├── error.tsx               # Error UI (optional)
└── _components/            # Page-specific components (optional)
```

### Naming Conventions

- **`_` prefix**: Page-specific folders (e.g., `_components/`, `_hooks/`) are prefixed with underscore to:
  - Indicate they are private to the route
  - Prevent Next.js from treating them as route segments
  - Clearly distinguish page-specific code from shared code

### Page Component Pattern

```tsx
// app/users/page.tsx (Server Component)
import { getUsers } from '@/features/users/api'
import { UserList } from './_components/UserList'

export default async function UsersPage() {
  const users = await getUsers()
  return <UserList users={users} />
}
```

```tsx
// app/users/_components/UserList.tsx (Client or Server Component)
import { UserCard } from './UserCard'
import type { User } from '@/features/users/types'

type Props = {
  users: User[]
}

export function UserList({ users }: Props) {
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}
```

## Principles

1. **Feature-Page 1:1 Mapping**: Each route in `app/` corresponds to exactly one feature. This keeps routing and business logic tightly coupled.
2. **Feature Isolation**: Each feature should be self-contained with minimal dependencies on other features. Avoid cross-feature imports.
3. **Shared Components**: Common UI elements are placed in `shared/components/` for reuse.
4. **Domain-Driven**: Features should align with business domains rather than technical concerns.
5. **Container 1st Design**: Always start with containers that define what needs to be done, then create presenters.
6. **Separation of Concerns**: 
   - Containers handle logic and data
   - Presenters handle UI and styling
7. **Layered Approach Within Features**:
   - UI Layer: Presenters
   - Application Layer: Containers, hooks
   - Domain Layer: Business logic, data transformation
   - Infrastructure Layer: API calls, external services integration
8. **Colocation**: Keep related code close together. Page-specific components live in `_components/` within the route.

## Data Flow

1. Container components fetch and manage data
2. Data flows down to presentational components via props
3. User events in presentational components trigger callbacks defined in container components
4. Container components update state based on these events

## Dependency Direction

Dependencies should flow unidirectionally:

```
      shared/
         ↓
     features/
         ↓
       app/
```

### Rules

- **Shared → Features**: Shared code can be used by any feature
- **Features → App**: Features can be imported by app routes
- **Never**: Features should not import from other features
- **Never**: Shared code should not import from features or app
- Within features: Container → Presenter (one-way)

### Cross-Feature Communication

Instead of importing across features, compose them at the app level:

```tsx
// ❌ Bad: Cross-feature import
// features/comments/components/CommentList.tsx
import { UserAvatar } from '@/features/users/components'

// ✅ Good: Compose at app level
// app/posts/[slug]/_components/PostComments.tsx
import { CommentList } from '@/features/comments/components'
import { UserAvatar } from '@/features/users/components'
```

## Testing Strategy

- Container tests: Test business logic and state management
- Presenter tests: Test UI rendering and interactions
- Integration tests: Test container-presenter pairs working together
- End-to-end tests: Test complete user flows

## Implementation Guidelines

- Use TypeScript for type safety across the application
- Follow consistent naming conventions for files and components
  - ContainerName.tsx and NamePresenter.tsx
  - Use `_` prefix for page-specific folders (`_components/`, `_hooks/`)
- Keep presenters as pure functions when possible
- Document component APIs using JSDoc or Storybook
- Use custom hooks to extract and reuse complex logic from containers
- Prefer Server Components by default; use `'use client'` only when necessary
- Import files directly instead of using barrel files (better for tree shaking)

## State Management

- Feature-specific state should be contained within the feature module
- Cross-feature state should be managed through a central store or context
- Prefer Server Components and URL state over client-side state when possible

## Feature Structure

A feature should only include the folders that are necessary:

```
features/awesome-feature/
├── api/          # API request declarations and hooks
├── components/   # Components scoped to this feature
│   ├── containers/
│   └── presenters/
├── hooks/        # Hooks scoped to this feature
├── types/        # TypeScript types for this feature
└── utils/        # Utility functions for this feature
```
