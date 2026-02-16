# Transcript Search System Requirements

## Overview

A system that leverages transcript data from YouTube streams and clips to search and recommend videos through a chat-style interface.
To minimize costs, full-text search runs entirely in the browser using DuckDB-WASM.

## Background and Goals

- Users want to find "that topic" from VTuber streams and clips, but video titles alone are insufficient
- Cross-searching transcript data enables topic-based video discovery
- Surface-level search (full-text matching) is sufficient for the initial phase; vector search will be considered later

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Data Pipeline (Cloudflare Workflow)                     │
│                                                         │
│  POST video IDs from external source                    │
│       ↓                                                 │
│  Cloudflare Workflow (TranscriptWorkflow)                │
│  Create a Workflow instance per video                    │
│       ↓                                                 │
│  Step: fetch-and-save                                   │
│    1. Fetch json3 via Container (yt-dlp)                │
│    2. Save raw JSON to R2                               │
│       ↓                                                 │
│  Cloudflare R2                                          │
│  transcripts/raw/{videoId}/{lang}.json                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Search Frontend (browser-only)                         │
│                                                         │
│  Next.js (App Router)                                   │
│       ↓                                                 │
│  DuckDB-WASM                                            │
│  Load Parquet from R2 → full-text search via SQL        │
│       ↓                                                 │
│  Chat UI                                                │
│  Display search results as video cards                  │
└─────────────────────────────────────────────────────────┘
```

## Data Model

### Input: json3 format (yt-dlp output)

```json
{
  "events": [
    {
      "tStartMs": 0,
      "dDurationMs": 5000,
      "segs": [
        { "utf8": "hello" }
      ]
    }
  ]
}
```

### Normalized: transcripts table

| Column | Type | Description |
|--------|------|-------------|
| video_id | VARCHAR | YouTube video ID |
| title | VARCHAR | Video title |
| channel_id | VARCHAR | Channel ID |
| channel_name | VARCHAR | Channel name |
| published_at | TIMESTAMP | Publish date/time (UTC) |
| duration_sec | INTEGER | Video duration (seconds) |
| thumbnail_url | VARCHAR | Thumbnail URL |
| video_type | VARCHAR | 'stream' / 'clip' |

### Normalized: transcript_segments table

| Column | Type | Description |
|--------|------|-------------|
| video_id | VARCHAR | YouTube video ID (FK) |
| start_ms | INTEGER | Segment start time (ms) |
| duration_ms | INTEGER | Segment duration (ms) |
| text | VARCHAR | Transcript text |

### Search view: transcript_fulltext

Full text concatenated per video by joining segments. Primary search target.

| Column | Type | Description |
|--------|------|-------------|
| video_id | VARCHAR | YouTube video ID |
| full_text | VARCHAR | All segments concatenated |

## Search Approach

### Phase 1: Surface Search (Text Matching)

Implemented via SQL in DuckDB-WASM. No server-side component required.

```sql
-- Keyword search
SELECT t.video_id, t.title, t.channel_name, t.thumbnail_url,
       t.published_at, t.video_type
FROM transcripts t
JOIN transcript_fulltext ft ON t.video_id = ft.video_id
WHERE ft.full_text ILIKE '%search_keyword%'
ORDER BY t.published_at DESC
LIMIT 20;

-- Retrieve timestamps for matching segments
SELECT start_ms, duration_ms, text
FROM transcript_segments
WHERE video_id = ? AND text ILIKE '%search_keyword%'
ORDER BY start_ms;
```

**Search features:**
- Partial keyword matching (ILIKE)
- Multi-keyword AND/OR search
- Channel name filter
- Video type filter (stream / clip)
- Date range filter
- Timestamped link generation for matching segments

### Phase 2 (future): Semantic Search

- Vectorization with embedding models
- DuckDB vss extension or external vector DB
- Hybrid search (text + vector)

## Data Pipeline

### 1. Video List Management

- A mechanism to manage the list of target channel video IDs is needed
- Detect new videos via YouTube Data API v3 or RSS feeds
- Initial data loaded manually or via script

### 2. Transcript Retrieval + R2 Storage (transcriptor service)

Fetch and save in a single Cloudflare Workflow execution.

**Trigger (POST video IDs from external source):**

```bash
curl -X POST https://<worker>/run \
  -H "Content-Type: application/json" \
  -d '{"videoIds": ["dQw4w9WgXcQ", "abc123"], "lang": "ja"}'
```

**Workflow flow:**

```
POST /run { videoIds, lang }
  ↓ Create a Workflow instance per video

Step: fetch-and-save
  → Fetch json3 via Container (yt-dlp)
  → Save raw JSON to R2
  → Retry up to 3 times on failure (exponential backoff, 5-minute timeout)
```

**Progress check:**

```bash
GET /run/{instanceId}
# → { "instanceId": "...", "status": { ... } }
```

**R2 storage path:**

```
r2://transcripts/
└── transcripts/
    └── raw/
        ├── {videoId}/
        │   ├── ja.json     # Japanese subtitles
        │   └── en.json     # English subtitles (multi-language support)
        └── ...
```

### 3. ETL Processing (future)

```
raw JSON (R2) → segment splitting → metadata enrichment → Parquet conversion
```

### 4. Parquet File Design (future)

```
r2://transcripts/
├── transcripts/raw/...               # raw JSON (current)
├── transcripts.parquet              # Video metadata
├── transcript_segments.parquet      # Segment data
└── transcript_fulltext.parquet      # Full text (for search)
```

**Why Parquet:**
- DuckDB-WASM can partially load via HTTP Range Requests
- Columnar compression minimizes transfer size
- Embedded schema makes versioning straightforward

## Frontend

### Chat UI

```
┌──────────────────────────────────────┐
│  🔍 Stream & Clip Search             │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ User: "tournament practice"  │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ System:                      │    │
│  │ 3 results found              │    │
│  │                              │    │
│  │ ┌────────────────────────┐   │    │
│  │ │ 🎬 [Stream title]      │   │    │
│  │ │ ch: Channel name       │   │    │
│  │ │ 📅 2025-01-15          │   │    │
│  │ │ Matching segments:     │   │    │
│  │ │  ⏱ 1:23:45 "tourna..." │   │    │
│  │ │  ⏱ 1:45:00 "practi..." │   │    │
│  │ └────────────────────────┘   │    │
│  │ ...                          │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────┐  [Send] │
│  │ Enter message...          │        │
│  └──────────────────────────┘        │
└──────────────────────────────────────┘
```

**UI requirements:**
- Chat-style message exchange
- Search results displayed as video cards
- Clicking a timestamp navigates to the corresponding YouTube timecode (`&t=` parameter)
- Thumbnail display
- Stream / clip tag display
- Responsive layout

### DuckDB-WASM Integration

```typescript
// Initialization flow
// 1. Load DuckDB-WASM
// 2. Register Parquet files from R2 (httpfs)
// 3. Convert user input to SQL and execute
// 4. Render results in the UI
```

**Performance considerations:**
- Cache Parquet files on initial load (Service Worker or Cache API)
- Run DuckDB-WASM in a Web Worker to avoid blocking the main thread
- Fetch only required columns via partial Parquet reads (HTTP Range Requests)

## Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Transcript retrieval | Cloudflare Container + yt-dlp | Existing implementation available |
| ETL | TypeScript scripts | Integrates with existing ecosystem |
| Data storage | Cloudflare R2 + Parquet | Low cost, DuckDB-compatible |
| Search engine | DuckDB-WASM | Browser-only, SQL-based, free |
| Frontend | Next.js (App Router) | Existing stack |
| UI components | Existing shared components | Reuse |

## Cost Estimate

| Item | Cost |
|------|------|
| Cloudflare Workers (transcript retrieval) | Free plan: 100K requests/day |
| Cloudflare R2 (data storage) | 10 GB free, reads free |
| DuckDB-WASM | Free (runs in browser) |
| YouTube Data API | 10,000 units/day (free) |
| **Total** | **Effectively free** (within free tier) |

## Data Volume Estimate

| Item | Estimate |
|------|----------|
| Transcript per video | ~50 KB (json3) -> ~10 KB (Parquet compressed) |
| Target videos (initial) | ~1,000 |
| Total data size | ~10 MB (Parquet) |
| Browser memory usage | ~50 MB (DuckDB-WASM + data) |

Around 1,000 videos is a manageable scale for in-browser processing.
Beyond 10,000 videos, data partitioning or server-side search should be considered.

## Phased Roadmap

### Phase 1: MVP (Minimum Viable Product)

1. **ETL script**: json3 -> Parquet conversion + R2 upload
2. **Search UI**: Keyword search via DuckDB-WASM, chat-style interface
3. **Data ingestion**: Manually managed video ID list, batch retrieval via script

**Out of scope (Phase 1):**
- Automatic new video detection
- User authentication
- Search history / bookmarks
- Semantic search

### Phase 2: Automation

- Automatic new video detection via YouTube Data API / RSS
- Cron-based periodic ETL execution
- Incremental updates (process only new videos)

### Phase 3: Advanced Search

- Semantic search (embeddings)
- Natural language query -> SQL conversion via LLM
- Summary generation
- Similar video recommendations

## Implementation Notes

### DuckDB-WASM

- Use the `@duckdb/duckdb-wasm` package
- Run in a Web Worker to avoid blocking the main thread
- Query Parquet files on R2 directly via the `httpfs` extension
- Cache in the browser's IndexedDB to speed up subsequent loads

### Parquet Generation

- Use `duckdb` (native) or `apache-arrow` + `parquet-wasm` in Node.js
- Include a version in metadata for schema versioning

### Japanese Text Search

- Partial matching via `ILIKE` works as-is with Japanese text
- Morphological analysis is unnecessary for Phase 1 (partial matching is practical enough)
- N-gram indexing or morphological analysis may be considered in the future

### Error Handling

- Follow the existing `Result` type pattern
- Display a fallback UI on DuckDB-WASM initialization failure
- Retry + error notification on Parquet load failure
