# UI Specification — ぶいすぽコレクション（音声）

## 1. Purpose / Scope

- Target: Voice clip collection app for Vspo fans
- MVP scope:
  - Home (clip browsing, popular/new tabs, member filter)
  - Member detail (per-member clip list)
  - Playlist (curated lists, favorites)
  - Add voice (UGC clip submission from YouTube)
  - Merge & download (combine clips, export audio)

## 2. User Personas / Key Scenarios

### User Personas

- **Casual fan**: Browses popular clips, likes favorites, shares with friends
- **Dedicated oshi fan**: Follows specific member, builds custom playlists
- **Clip creator**: Submits new voice clips from streams, curates collections

### Key Scenarios

- Browse popular clips -> Like/save -> Create playlist
- Search by member -> Play clips -> Download/merge for personal use
- Find stream moment -> Submit clip (YouTube URL + time range) -> Community curation

### Experience Goals

| Phase | Goal | Emotional Design |
|-------|------|------------------|
| First visit | Understand value within 10 seconds | "I can hear my oshi's voice clips here" |
| First play | Tap a clip and hear it instantly | "This is fun, let me listen to more" |
| Building collection | Save favorites, create playlists | "My own voice clip collection" |
| Contributing | Submit a new clip from a stream | "I found a great moment to share" |

## 3. Information Architecture / Navigation

### Mobile Navigation (Tab Bar)

| Tab | Icon | Screen |
|-----|------|--------|
| Home | `home` | Clip feed with popular/new tabs |
| Member | `users` | Member list / member detail |
| Playlist | `list` | Playlist management |
| Add | `plus` | UGC clip submission form |

### Desktop Navigation (Sidebar)

| Section | Items |
|---------|-------|
| Main nav | Home, Member, Add voice |
| Playlists | Favorites, custom playlists, + New |

### Figma File

Design mockups: [Figma](https://www.figma.com/design/84XQRkIqqgbIfuILBe7G2E)

## 4. Screen-by-Screen Specification

### 4.1 Home

- **Purpose**: Browse and discover voice clips
- **Layout**: Mobile list / Desktop table with sidebar
- **Key elements**:
  - Tabs: Popular / New
  - Member filter chips (horizontal scroll on mobile)
  - Clip list: Avatar + title + member name + duration + like count
  - Playing state: Highlighted row with inline progress bar
  - Mini player bar (mobile) / Full player bar (desktop)
- **Interactions**:
  - Tap clip to play
  - Tap heart to like/unlike
  - Swipe chips to filter by member

### 4.2 Member Detail

- **Purpose**: View all clips for a specific member
- **Layout**: Hero gradient + clip table
- **Key elements**:
  - Hero: Large avatar (member initial on brand color), member name, stats (clip count, total likes)
  - Action buttons: Play all, Shuffle
  - Clip table: Numbered list with play icons, dates, like counts
  - Sort control: Popular / Newest
- **Hero gradient**: `color-mix(in srgb, var(--c-{member}) 25%-30%, var(--bg))`

### 4.3 Playlist

- **Purpose**: Manage curated clip collections
- **Layout**: Mobile card list / Desktop 2-column grid
- **Key elements**:
  - Playlist cards: Title, clip count, duration badge, 3-clip preview
  - Favorites card: Special warm tint using `--like-bg`
  - Action buttons per card: Play, Download, Merge
  - New playlist button
- **Playlist card preview**: Shows first 3 clips with mini avatars

### 4.4 Add Voice (UGC)

- **Purpose**: Submit new voice clips from YouTube streams
- **Layout**: Mobile single form / Desktop two-column (form + preview)
- **Key elements**:
  - Source toggle: YouTube URL / File upload
  - YouTube URL input with hint text
  - Time range picker: Start / End (format `H:MM:SS`)
  - Member dropdown with avatar preview
  - Title input with character count (max 50)
  - Preview card: Avatar + title + duration + play button
  - Submit button
- **Desktop extras**: Tips card with submission guidelines

### 4.5 Merge & Download

- **Purpose**: Combine multiple clips and export as audio file
- **Layout**: Mobile sequential / Desktop two-column (drag list + preview)
- **Key elements**:
  - Drag-to-reorder clip list with grip handles
  - Visual connectors between clips
  - Dragging state: Accent border + shadow
  - Waveform preview visualization
  - Playback controls: Prev / Play / Next
  - Format selector: MP3 / WAV / OGG with estimated file sizes
  - Action buttons: Download, Save as playlist
- **Total info bar**: Clip count + total duration

## 5. Shared UI Components

### Player Bar (Desktop)

Full-width fixed bottom bar with:
- Progress indicator
- Now-playing info: Avatar + title + member name + like button
- Controls: Prev / Play-Pause / Next
- Seek track with dot scrubber
- Volume control

### Mini Player (Mobile)

Compact bar above tab bar with:
- Progress line
- Avatar + title + member name
- Pause / Next buttons

### Avatars

Member initial character in a colored circle using the member's brand color.

| Size | Usage |
|------|-------|
| 28px | Clip preview in playlists |
| 36px | Mini player, drag items |
| 44px | Clip list items, player bar |
| 160px | Member detail hero (desktop) |
| 80px | Member detail hero (mobile) |

### Buttons

| Type | Background | Text | Usage |
|------|-----------|------|-------|
| Primary | `--accent` | White | Submit, Play all, Download |
| Secondary | `--accent-bg` | `--accent` | Shuffle, Save as playlist |
| Ghost | transparent | `--ink-soft` | Sort, filter |
| Like | transparent | `--like-color` (active) / `--ink-faint` (inactive) | Heart toggle |

### Chips

- Default: `--surface` bg, `--border` stroke, `--ink-soft` text
- Active: `--accent` bg, white text

### Cards

- Background: `--surface`
- Border radius: `--radius-lg` (16px)
- Shadow: `0 2px 8px rgba(0,0,0,0.04)`
- Favorites variant: gradient from `--like-bg` to white

## 6. State Management (UI)

### Playing State

- Clip row: `--accent-bg` background, accent-colored title
- Animated playing bars (4 bars, staggered animation)
- Progress bar with `--accent` fill and draggable dot

### Loading States

- Skeleton UI for clip lists (maintains row height)
- Shimmer animation on avatar circles

### Empty States

- No clips: Illustration-free message with CTA to add voice
- No playlists: Prompt to create first playlist

### Error States

- Network error: Retry button + "Could not load clips" message
- Failed upload: Inline error on form with specific message

## 7. Responsive Behavior

| Aspect | Mobile (390px) | Desktop (1440px) |
|--------|---------------|-----------------|
| Navigation | Bottom tab bar | Left sidebar (260px) |
| Clip display | Vertical list | Table with columns |
| Player | Mini player above tabs | Full player bar at bottom |
| Playlists | Stacked cards | 2-column grid |
| Add voice | Single form | Two-column with preview panel |
| Merge | Sequential list | Two-column with preview panel |

## 8. Micro-interactions

| Element | Animation | Duration |
|---------|-----------|----------|
| Like heart | Scale bounce on tap | 200ms |
| Tab switch | Underline slide | 150ms |
| Chip select | Background fade | 100ms |
| Playing bars | Height oscillation | 800ms loop |
| Drag reorder | Lift with shadow | 150ms |
| Progress dot | Smooth tracking | 16ms (60fps) |

## 9. Design Constraints

- **No images**: Use text initials in colored circles (no member photos due to copyright)
- **No emoji**: All icons must be SVG (Lucide-style, 24x24, stroke-width 2)
- **No AI aesthetic**: Avoid gradients, glows, or effects that look AI-generated
- **Simple & pop**: Warm, approachable feel with M PLUS Rounded 1c font

## References

- [Color Guidelines](./colors.md)
- [Design Tokens](./design-tokens.md)
- [Typography Guidelines](./typography.md)
- [Icon Guidelines](./icons.md)
- [Design Patterns](./design-patterns.md)
