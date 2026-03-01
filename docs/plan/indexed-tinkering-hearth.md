# Fix PR #14 CI failures

## Context

PR #14 ("chore: consolidate config files and set up Biome linter") has 4 failing CI jobs:
- **type-check** — 20+ TypeScript errors in `services/web` (Avatar props mismatch, missing sizes, LikeButton missing `count`, RouterProvider children)
- **semgrep** — 4 blocking SAST findings (Dockerfile USER, dangerous exec, XSS, workflow injection)
- **trivy-fs** — rollup CVE-2026-27606 (4.57.1 → needs >=4.59.0)
- **trivy-container** — yt-dlp CVE-2026-26331 (2026.2.4 → needs >=2026.02.21)

`build` and `biome-check` already pass.

---

## 1. Fix type-check errors (`services/web`)

### 1a. Avatar component — accept `member` prop + add `xs`/`xl` sizes

**File:** `services/web/src/shared/components/ui/Avatar.tsx`

The Avatar component defines `{ char, bgColor, size?, hasRing?, className? }` but all callers pass `{ member, size }`. The `Member` type has `initial` (→ char) and `color` (→ bgColor).

**Changes:**
- Import `Member` type from `@/shared/lib/members`
- Change props to accept `member: Member` instead of `char`/`bgColor`
- Internally use `member.initial` as char, `member.color` as bgColor
- Use `member.avatarTextColor` to set text color (currently hardcoded to `#FFFFFF`)
- Add `xs` and `xl` size variants:
  ```
  xs: "h-7 w-7 text-[11px]"
  xl: "h-28 w-28 text-[40px]"
  ```

### 1b. LikeButton — make `count` optional

**File:** `services/web/src/shared/components/ui/LikeButton.tsx`

`count` is required but `PlayerBarPresenter` and the `WithoutCount` story don't pass it.

**Change:** Make `count` optional (`count?: number`). Hide the count `<span>` when `count` is `undefined`.

### 1c. SidebarPresenter.stories.tsx — fix RouterProvider usage

**File:** `services/web/src/features/voice-collection/components/presenters/SidebarPresenter.stories.tsx`

TanStack Router's `RouterProvider` does not accept `children`.

**Change:** Set the root route's `component` to render `<Story />` within the wrapper div, instead of passing children to `RouterProvider`:

```tsx
function createStoryRouter(Story: () => JSX.Element) {
  const rootRoute = createRootRoute({
    component: () => (
      <div className="w-[260px] h-screen border-r border-border bg-surface">
        <Story />
      </div>
    ),
  });
  ...
}
```

### 1d. Avatar.stories.tsx — update to use `member` prop

**File:** `services/web/src/shared/components/ui/Avatar.stories.tsx`

After fix 1a, all existing `member: X` args will work. Sizes `xs`/`xl` will also be valid.

No changes needed beyond the Avatar component fix itself.

---

## 2. Fix semgrep findings (4 blocking)

### 2a. Dockerfile: add non-root USER

**File:** `services/transcriptor/Dockerfile`

Add before `CMD`:
```dockerfile
RUN adduser -D -u 1000 appuser
USER appuser
```

Note: `/server` binary and yt-dlp need to be executable by appuser. The binary is at root `/server` — ensure `COPY --from=build` copies with correct permissions, or `chmod` it. yt-dlp is installed system-wide via pip so it should be accessible.

### 2b. Dangerous exec: allowlist `req.Bin`

**File:** `services/transcriptor/ytdlp/main.go` (line 39-44)

Add an allowlist check before `exec.Command`:
```go
var allowedBins = map[string]bool{
    "yt-dlp": true,
}

// In execHandler, after req.Bin empty check:
if !allowedBins[req.Bin] {
    http.Error(w, `{"error":"bin not allowed"}`, http.StatusForbidden)
    return
}
```

### 2c. XSS via fmt.Fprintf: use json.Encode

**File:** `services/transcriptor/ytdlp/main.go` (line 93-96)

Replace `fmt.Fprintf` with proper JSON encoding:
```go
func healthHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{
        "status":   "ok",
        "instance": os.Getenv("CLOUDFLARE_DURABLE_OBJECT_ID"),
    })
}
```

### 2d. Workflow script injection

**File:** `.github/workflows/cf-deploy.yml` (line 43-51)

`${{ inputs.service }}` and `${{ steps.filter.outputs.changes }}` are interpolated in a `run:` block. Fix by using environment variables:

```yaml
- id: set-matrix
  env:
    EVENT_NAME: ${{ github.event_name }}
    INPUT_SERVICE: ${{ inputs.service }}
    FILTER_CHANGES: ${{ steps.filter.outputs.changes }}
  run: |
    if [[ "$EVENT_NAME" == "workflow_dispatch" ]]; then
      if [[ "$INPUT_SERVICE" == "all" ]]; then
        echo 'matrix=["transcriptor","web"]' >> "$GITHUB_OUTPUT"
      else
        echo "matrix=[\"$INPUT_SERVICE\"]" >> "$GITHUB_OUTPUT"
      fi
    else
      echo "matrix=$FILTER_CHANGES" >> "$GITHUB_OUTPUT"
    fi
```

---

## 3. Fix trivy-fs: rollup CVE

**File:** `package.json` (root)

Add pnpm overrides to bump rollup:
```json
"pnpm": {
  "overrides": {
    "rollup": ">=4.59.0"
  }
}
```

Then regenerate lockfile: `pnpm install` (in `services/web/`).

---

## 4. Fix trivy-container: yt-dlp CVE

**File:** `services/transcriptor/Dockerfile` (line 18-19)

Pin yt-dlp to fixed version:
```dockerfile
pip install --no-cache-dir --break-system-packages "yt-dlp>=2026.02.21"
```

---

## Files to modify

| # | File | Changes |
|---|------|---------|
| 1 | `services/web/src/shared/components/ui/Avatar.tsx` | Accept `member` prop, add `xs`/`xl` sizes, use `avatarTextColor` |
| 2 | `services/web/src/shared/components/ui/LikeButton.tsx` | Make `count` optional |
| 3 | `services/web/src/features/voice-collection/components/presenters/SidebarPresenter.stories.tsx` | Fix RouterProvider children usage |
| 4 | `services/web/src/features/voice-collection/components/presenters/PlayerBarPresenter.tsx` | Pass `count` to LikeButton (already has `currentClip.likeCount`) |
| 5 | `services/transcriptor/Dockerfile` | Add non-root USER, pin yt-dlp version |
| 6 | `services/transcriptor/ytdlp/main.go` | Allowlist exec bins, use json.Encode for health |
| 7 | `.github/workflows/cf-deploy.yml` | Use env vars instead of `${{ }}` in run block |
| 8 | `package.json` (root) | Add `pnpm.overrides.rollup` |

---

## Verification

1. `pnpm turbo type-check` — all 5 packages pass
2. `pnpm turbo build` — all packages build
3. `pnpm turbo biome:check` — no errors
4. Push and verify all 6 CI jobs pass (type-check, build, biome-check, semgrep, trivy-fs, trivy-container)
