# @vspo/dayjs

A utility package for date manipulation and formatting using day.js.

## Installation

```bash
pnpm add @vspo/dayjs
```

## Usage

```typescript
import {
  getCurrentUTCDate,
  getCurrentTimestamp,
  formatToJST,
  formatToLocalizedDate
} from '@vspo/dayjs';

// Get current UTC date
const now = getCurrentUTCDate();

// Get current timestamp (replaces Date.now())
const timestamp = getCurrentTimestamp();

// Format for Japanese display
const jstDate = formatToJST(now);

// Format for localized display
const localizedDate = formatToLocalizedDate(now, 'ja');
```

## Dependencies

- dayjs: ^1.11.19
- zod: ^4.x

## Development

```bash
# Build the package
pnpm build
```

## Version

Current version: 0.1.0