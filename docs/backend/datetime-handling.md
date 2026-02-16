# Date/Time Handling Guidelines

This document describes the datetime handling conventions for this application.

## Core Principles

1. **UTC as the Standard**: All server-side timestamps and stored dates use UTC
2. **JST for Display**: Frontend displays dates in Japan Standard Time (JST/Asia/Tokyo) for Japanese users
3. **Use `@vspo/dayjs`**: Always use the shared dayjs package instead of native `Date` objects

## Package: `@vspo/dayjs`

The `@vspo/dayjs` package provides consistent datetime utilities across the application.

### Installation

The package is already included in both `services/server` and `services/my-app`.

```typescript
import {
  getCurrentUTCDate,
  getCurrentTimestamp,
  formatToJST,
  formatToLocalizedDate,
} from "@vspo/dayjs";
```

## Server-Side (Backend)

### Getting Current Time

```typescript
import { getCurrentUTCDate, getCurrentTimestamp } from "@vspo/dayjs";

// Get current time as Date object (UTC)
const now = getCurrentUTCDate();

// Get current timestamp in milliseconds (replaces Date.now())
const timestamp = getCurrentTimestamp();
```

### Database Operations

All database timestamps should be stored in UTC:

```typescript
import { getCurrentUTCDate } from "@vspo/dayjs";

// Creating records
await db.insert(table).values({
  createdAt: getCurrentUTCDate(),
  updatedAt: getCurrentUTCDate(),
});
```

### Token/Session Expiration

```typescript
import { addMillisecondsFromNow, convertToUTC } from "@vspo/dayjs";

// Create expiration time
const TOKEN_EXPIRE_MS = 30 * 60 * 1000; // 30 minutes
const expireTime = convertToUTC(addMillisecondsFromNow(TOKEN_EXPIRE_MS));
```

## Frontend (Client-Side)

### Getting Current Time

```typescript
import { getCurrentUTCDate, getCurrentTimestamp } from "@vspo/dayjs";

// For timestamp calculations (e.g., elapsed time)
const startTime = getCurrentTimestamp();
// ... later
const elapsed = getCurrentTimestamp() - startTime;
```

### Displaying Dates to Users

For Japanese users, use JST formatting:

```typescript
import { formatToJST, formatToJSTShort } from "@vspo/dayjs";

// Full format example: "January 15, 2024, 10:30:00"
const fullDate = formatToJST(utcDate);

// Short format: "2024/01/15"
const shortDate = formatToJSTShort(utcDate);
```

For multi-language support:

```typescript
import { formatToLocalizedDate } from "@vspo/dayjs";

// Automatically formats based on language code
const localizedDate = formatToLocalizedDate(utcDate, "ja"); // Japanese
const localizedDate = formatToLocalizedDate(utcDate, "en"); // English
```

### Filename Generation

```typescript
import { formatToISODate, formatToFilenameSafeISO, getCurrentUTCDate } from "@vspo/dayjs";

// For date-only filenames: "2024-01-15"
const dateStr = formatToISODate(getCurrentUTCDate());
const filename = `export-${sessionId}-${dateStr}.webm`;

// For timestamp filenames: "2024-01-15T10-30-00-000Z"
const timestamp = formatToFilenameSafeISO(getCurrentUTCDate());
const filename = `recording-${timestamp}.webm`;
```

### Date Filtering

```typescript
import {
  getCurrentUTCDate,
  subtractDays,
  convertToUTCDate,
  isBefore,
} from "@vspo/dayjs";

// Filter items from last 7 days
const now = getCurrentUTCDate();
const cutoffDate = subtractDays(now, 7);
const filteredItems = items.filter(
  (item) => !isBefore(convertToUTCDate(item.date), cutoffDate)
);
```

## Available Functions

### Time Getters

| Function | Return Type | Description |
|----------|-------------|-------------|
| `getCurrentUTCDate()` | `Date` | Current UTC time as Date object |
| `getCurrentUTCString()` | `string` | Current UTC time as ISO string |
| `getCurrentTimestamp()` | `number` | Current UTC timestamp in milliseconds |
| `getCurrentYear()` | `number` | Current year in UTC |

### Conversion Functions

| Function | Return Type | Description |
|----------|-------------|-------------|
| `convertToUTC(input)` | `string` | Convert to UTC ISO string |
| `convertToUTCDate(input)` | `Date` | Convert to UTC Date object |
| `convertToUTCTimestamp(input, tz)` | `string` | Convert from timezone to UTC |

### Formatting Functions

| Function | Return Type | Description |
|----------|-------------|-------------|
| `formatToISODate(input)` | `string` | Format as "YYYY-MM-DD" |
| `formatToFilenameSafeISO(input)` | `string` | Format as "YYYY-MM-DDTHH-mm-ss-SSSZ" |
| `formatToJST(input)` | `string` | Format for JST display (full) |
| `formatToJSTShort(input)` | `string` | Format for JST display (YYYY/MM/DD) |
| `formatToLocalizedDate(input, lang)` | `string` | Format based on language |

### Date Arithmetic

| Function | Return Type | Description |
|----------|-------------|-------------|
| `addMillisecondsFromNow(ms)` | `Date` | Add milliseconds to current time |
| `addMinutes(input, minutes)` | `Date` | Add minutes to date |
| `subtractDays(input, days)` | `Date` | Subtract days from date |
| `subtractMinutes(input, minutes)` | `Date` | Subtract minutes from date |

### Comparison Functions

| Function | Return Type | Description |
|----------|-------------|-------------|
| `isBefore(date1, date2)` | `boolean` | Check if date1 is before date2 |

## Supported Languages/Timezones

| Code | Locale | Timezone |
|------|--------|----------|
| `ja` | ja-JP | Asia/Tokyo |
| `en` | en-US | UTC |
| `ko` | ko-KR | Asia/Seoul |
| `cn` | zh-CN | Asia/Shanghai |
| `tw` | zh-TW | Asia/Taipei |
| `fr` | fr-FR | Europe/Paris |
| `de` | de-DE | Europe/Berlin |
| `es` | es-ES | Europe/Madrid |
| `default` | ja-JP | Asia/Tokyo |

## Migration from Native Date

### Before

```typescript
// Don't use these
const now = new Date();
const timestamp = Date.now();
const year = new Date().getFullYear();
const isoString = new Date().toISOString();
```

### After

```typescript
import {
  getCurrentUTCDate,
  getCurrentTimestamp,
  getCurrentYear,
  getCurrentUTCString,
} from "@vspo/dayjs";

const now = getCurrentUTCDate();
const timestamp = getCurrentTimestamp();
const year = getCurrentYear();
const isoString = getCurrentUTCString();
```

## Testing

When testing time-dependent code, use Vitest's fake timers:

```typescript
import { beforeEach, afterEach, vi } from "vitest";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2025-01-15T10:00:00.000Z"));
});

afterEach(() => {
  vi.useRealTimers();
});
```

Note: `@vspo/dayjs` functions work correctly with Vitest's fake timers since they use dayjs internally, which respects the mocked system time.
