# vspo-search

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A voice clip collection app for VTuber (Vspo) fans. Browse curated voice clips, build personal collections, and contribute new clips.

## Tech Stack

- **Web**: TanStack Router + React, Cloudflare Workers
- **Storage**: Cloudflare R2 (audio files + catalog metadata)
- **Shared Packages**: TypeScript, Zod, Vitest
- **CI/CD**: GitHub Actions, Cloudflare Deploy

## Project Structure

```
services/
└── web/                 # Voice collection web app (TanStack Router)

packages/
├── errors/              # Result-type-based error handling
├── logger/              # tslog-based logger
└── dayjs/               # Date/time utilities
```

## Setup

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev
```

## Testing

```bash
# Run all tests
pnpm test

# Post-edit checks (build + lint + type-check + test)
./scripts/post-edit-check.sh
```

## License

[MIT](LICENSE)
