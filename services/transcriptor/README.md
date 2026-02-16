# @vspo/transcriptor

Cloudflare Worker service for transcript extraction using yt-dlp in Cloudflare Containers.

## Architecture

- **Worker**: Hono-based HTTP API + Cloudflare Workflow orchestration
- **Container**: Go server wrapping yt-dlp for subtitle extraction
- **Storage**: R2 bucket for transcript persistence

## Development

```bash
pnpm dev
```

## Deployment

```bash
pnpm deploy
```
