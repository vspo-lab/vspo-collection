# vspo-search

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A transcript search system for VTuber content. It extracts subtitles from YouTube videos and provides full-text search.

## Tech Stack

- **Transcriptor**: Cloudflare Workers + Containers (yt-dlp), Hono, R2
- **Shared Packages**: TypeScript, Zod, Vitest
- **CI/CD**: GitHub Actions, Cloudflare Deploy

## Project Structure

```
services/
└── transcriptor/        # Cloudflare Worker + Container (transcript extraction)

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
