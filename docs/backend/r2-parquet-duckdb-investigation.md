# R2 Parquet + DuckDB-WASM Technical Investigation

Companion to [r2-parquet-duckdb-architecture.md](./r2-parquet-duckdb-architecture.md). This document captures concrete codebase investigation findings that inform implementation.

---

## 1. Current Codebase Status

### What Exists

| Component | Location | Status |
|-----------|----------|--------|
| yt-dlp transcript ingestion | `services/transcriptor/` | Working. Fetches JSON3 and stores in R2 |
| R2 raw storage | `transcripts/raw/{videoId}/{lang}.json` | Active (bucket: `yt-transcripts`) |
| Transcript domain model | `services/transcriptor/src/domain/transcript.ts` | 3 stages: `raw`, `chunked`, `proofread` |
| Web app (TanStack Start) | `services/web/` | Running with mock data only |
| UI presenter components | `services/web/src/features/transcript-search/components/presenters/` | Built, using fixtures |
| Mock channel registry | `services/web/src/features/transcript-search/__mocks__/fixtures.ts` | 31 members (25 JP + 6 EN) |

### What's Missing

| Component | Gap |
|-----------|-----|
| ETL pipeline (JSON3 → Parquet) | No code, no GitHub Actions workflow |
| R2 public bucket for datasets | Not created, no CORS config |
| `manifest.json` generation | Not implemented |
| `@duckdb/duckdb-wasm` | Not installed in `services/web` |
| DuckDB initialization (Web Worker) | Not implemented |
| Search query layer | No `features/transcript-search/api/` directory |
| COOP/COEP headers | Not in `services/web/wrangler.jsonc` |
| JSON3 Zod schema | No parser exists in the codebase |
| Channel registry (production) | Only mock data with slug IDs, no YouTube `channel_id` mapping |

---

## 2. yt-dlp JSON3 Format Analysis

### How JSON3 is Produced

From `services/transcriptor/src/infra/container/ytdlp.ts`, the yt-dlp command:

```sh
yt-dlp --write-auto-sub --sub-lang "$LANG" --sub-format json3 \
       --skip-download -o "$TMP_PATH" \
       "https://www.youtube.com/watch?v=$VIDEO_ID"
```

The raw stdout is stored as-is in R2 at `transcripts/raw/{videoId}/{lang}.json`.

### JSON3 Structure

```json
{
  "wireMagic": "pb3",
  "events": [
    {
      "tStartMs": 12340,
      "dDurationMs": 2000,
      "segs": [
        { "utf8": "transcript text " },
        { "utf8": "continued here" }
      ]
    },
    {
      "tStartMs": 14340,
      "dDurationMs": 1500,
      "segs": [
        { "utf8": "\n" }
      ]
    },
    {
      "tStartMs": 20000
    }
  ]
}
```

### ETL Parsing Rules

1. **Filter**: Skip events without a `segs` array (timing markers only).
2. **Filter**: Skip events where concatenated `segs[].utf8` is only whitespace or `"\n"`.
3. **Concatenate**: Join `segs[].utf8` within each event to produce a single `text` string.
4. **Map to Parquet columns**:
   - `events[].tStartMs` → `transcript_segments.start_ms`
   - `events[].dDurationMs` → `transcript_segments.duration_ms`
   - concatenated `segs[].utf8` → `transcript_segments.text`
5. **Trim**: Strip leading/trailing whitespace from each segment text.

### Zod Schema Needed

No JSON3 parser exists yet. The ETL must add a Zod schema:

```typescript
const json3SegmentSchema = z.object({
  utf8: z.string(),
});

const json3EventSchema = z.object({
  tStartMs: z.number(),
  dDurationMs: z.number().optional(),
  segs: z.array(json3SegmentSchema).optional(),
});

const json3Schema = z.object({
  wireMagic: z.string().optional(),
  events: z.array(json3EventSchema),
});
```

---

## 3. Data Shape Gap: Parquet Output → UI Types

The DuckDB query layer must bridge between raw Parquet columns and the UI's `VideoCard` / `Timestamp` types defined in `services/web/src/features/transcript-search/types/domain.ts`.

### Field-by-Field Mapping

| UI Field | Source | Transformation |
|----------|--------|----------------|
| `VideoCard.id` | `transcripts.video_id` | Direct |
| `VideoCard.title` | `transcripts.title` | Direct |
| `VideoCard.channel` | `transcripts.channel_id` | Lookup from channel registry (see section 4) |
| `VideoCard.date` | `transcripts.published_at` | Format as `YYYY/MM/DD` |
| `VideoCard.type` | `transcripts.video_type` | Direct (`"stream"` \| `"clip"`) |
| `VideoCard.duration` | `transcripts.duration_sec` | Convert to `"H:MM:SS"` or `"M:SS"` |
| `VideoCard.thumbnailGradient` | `transcripts.thumbnail_url` | **Gap**: UI uses CSS gradient, Parquet stores URL. Replace with `<img>` or derive gradient from channel color |
| `VideoCard.timestamps[].time` | `transcript_segments.start_ms` | Convert ms to `"H:MM:SS"` |
| `VideoCard.timestamps[].timeInSeconds` | `transcript_segments.start_ms` | `Math.floor(start_ms / 1000)` |
| `VideoCard.timestamps[].text` | `transcript_segments.text` | Direct |
| `VideoCard.timestamps[].highlightedText` | `transcript_segments.text` + query | Inject `<mark>` tags around matched keywords at query time |
| `VideoCard.url` | `transcripts.video_id` | Derive: `https://www.youtube.com/watch?v=${video_id}` |

### Key Gaps

1. **Channel enrichment**: Parquet only has `channel_id` and `channel_name`. The UI's `Channel` type requires `colorHex` and `group` ("JP" \| "EN") — these come from a static channel registry, not from Parquet.

2. **Thumbnail**: The mock UI uses `thumbnailGradient` (a CSS gradient string). In production, either:
   - Use the real `thumbnail_url` from Parquet (requires changing the presenter component)
   - Generate a gradient from the channel's `colorHex` (keeps current design but loses real thumbnails)

3. **Highlight injection**: `highlightedText` with `<mark>` tags must be generated at query time in the browser. The raw `text` from DuckDB is plain — the search query layer must wrap matched keywords with `<mark>` before passing to the presenter.

---

## 4. Channel Registry

### Current State

`services/web/src/features/transcript-search/__mocks__/fixtures.ts` defines 31 members:

**JP (25 members)**:
`sumire`, `nazuna`, `toto`, `uruha`, `noa`, `mimi`, `sena`, `hinano`, `lisa`, `ren`, `kyupi`, `beni`, `emma`, `runa`, `tsuna`, `ramune`, `met`, `akari`, `kuromu`, `kokage`, `yuuhi`, `hanabi`, `moka`, `seine`, `chise`

**EN (6 members)**:
`remia`, `arya`, `jira`, `narin`, `riko`, `eris`

Each entry has: `{ id: slug, name: string, colorHex: string, group: "JP" | "EN" }`.

### Production Requirements

- Move from `__mocks__/fixtures.ts` to a proper shared data file (e.g., `features/transcript-search/data/channels.ts`).
- Add a `youtubeChannelId` field to map from Parquet's `channel_id` to the UI's `Channel`.
- The lookup must handle clip channels that aren't in the member list (e.g., `"ぶいすぽ切り抜き"` in mock data).

### Lookup Pattern

```typescript
const channelMap = new Map<string, Channel>(
  channels.map(ch => [ch.youtubeChannelId, ch])
);

function resolveChannel(channelId: string, channelName: string): Channel {
  return channelMap.get(channelId) ?? {
    id: channelId,
    name: channelName,
    colorHex: "#D9D9D9",  // default gray
    group: "JP",
  };
}
```

---

## 5. Web App Infrastructure Gaps

### `services/web/wrangler.jsonc` (current)

```jsonc
{
  "name": "vspo-search-web",
  "compatibility_date": "2025-09-02",
  "compatibility_flags": ["nodejs_compat"],
  "main": "@tanstack/react-start/server-entry",
  "observability": { "enabled": true }
}
```

No R2 bindings, no custom headers. Changes needed:

### COOP/COEP Headers

DuckDB-WASM requires `SharedArrayBuffer`, which requires these response headers:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: credentialless
```

Using `credentialless` (instead of `require-corp`) to allow loading cross-origin resources like YouTube thumbnails without `crossorigin` attributes. Supported in Chrome 96+, Firefox 114+.

For the Cloudflare Worker, these headers must be set on every HTML response. Options:
- Add a Cloudflare Transform Rule via dashboard
- Set headers in the TanStack Start server middleware
- Configure in `wrangler.jsonc` (if supported for Workers Sites)

### R2 Binding

The web Worker does **not** need an R2 binding. DuckDB-WASM in the browser fetches Parquet directly from R2's public URL via `httpfs`. The web Worker only serves the HTML/JS app.

### `@duckdb/duckdb-wasm` Package

Must be added to `services/web/package.json`. The WASM binary (~4MB) should be loaded from a CDN (jsDelivr default) rather than bundled, to keep the deploy artifact small.

---

## 6. Video Metadata Source (Open Investigation)

The `transcripts.parquet` schema requires fields not present in the JSON3 subtitle file:

| Field | In JSON3? | Alternative Source |
|-------|-----------|-------------------|
| `video_id` | Implicit (filename) | R2 object key: `transcripts/raw/{videoId}/{lang}.json` |
| `title` | No | YouTube Data API or yt-dlp `--write-info-json` |
| `channel_id` | No | YouTube Data API or yt-dlp `--write-info-json` |
| `channel_name` | No | YouTube Data API or yt-dlp `--write-info-json` |
| `published_at` | No | YouTube Data API or yt-dlp `--write-info-json` |
| `duration_sec` | No (only segment-level) | YouTube Data API, or sum of all segment durations |
| `thumbnail_url` | No | YouTube Data API or derive from `video_id`: `https://i.ytimg.com/vi/{videoId}/hqdefault.jpg` |
| `video_type` | No | Must be classified externally (stream vs clip) |

**Options**:
1. **yt-dlp `--write-info-json`**: Add this flag to the existing transcriptor workflow. Produces a `{videoId}.info.json` sidecar with all metadata. Requires modifying `ytdlp.ts` and the workflow.
2. **YouTube Data API**: Separate batch call. More reliable for `video_type` classification (via `snippet.liveBroadcastContent` or duration heuristics).
3. **Hybrid**: Use yt-dlp info_json for most fields, YouTube Data API only for `video_type` classification.

This decision blocks ETL implementation and should be resolved before starting.

---

## References

- [Architecture doc](./r2-parquet-duckdb-architecture.md)
- [Domain requirements](../domain/transcript-search.md)
- [UI domain types](../../services/web/src/features/transcript-search/types/domain.ts)
- [Mock fixtures](../../services/web/src/features/transcript-search/__mocks__/fixtures.ts)
- [yt-dlp container code](../../services/transcriptor/src/infra/container/ytdlp.ts)
- [Transcript domain model](../../services/transcriptor/src/domain/transcript.ts)
