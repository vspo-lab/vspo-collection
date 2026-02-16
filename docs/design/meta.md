# Meta Information Guidelines

## Overview

Meta information is an important configuration for optimizing how the site appears on search engines and social media. This guideline defines how to set up favicons, OGP, apple-touch-icons, and the web manifest.

## Favicon

### Recommended Specifications

| Item | Recommended Value |
|------|-------------------|
| Size | 48 x 48 px |
| Format | PNG |
| Color mode | RGB (with transparency) |

### Why 48x48px?

- **High-resolution display support**: Compatible with high pixel density displays such as Retina
- **Google Search display**: Google recommends multiples of 48x48px
- **Scalability**: Browsers automatically downscale when a smaller size is needed

### Why PNG?

- All major modern browsers support the PNG format
- Easier to work with than ICO, and supports transparency
- Manageable as a single file

### Implementation

```html
<link rel="icon" href="/favicon.png" type="image/png" />
```

## Apple Touch Icon

### Recommended Specifications

| Item | Recommended Value |
|------|-------------------|
| Size | 180 x 180 px |
| Format | PNG |
| Rounded corners | Not required (the OS applies them automatically) |

### Why 180x180px?

According to the [Apple documentation](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html), this is the recommended size for Retina iPads. When a smaller icon is needed, the OS automatically generates it from this size.

### Implementation

```html
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

## OGP (Open Graph Protocol)

### Basic Setup

```html
<meta property="og:title" content="Page Title" />
<meta property="og:description" content="Page description" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://example.com/page" />
<meta property="og:image" content="https://example.com/ogp.png" />
<meta property="og:site_name" content="Site Name" />
<meta property="og:locale" content="ja_JP" />
```

### OGP Image Recommended Specifications

| Item | Recommended Value |
|------|-------------------|
| Size | 1200 x 630 px |
| Aspect ratio | 1.91:1 |
| Format | PNG or JPG |
| File size | 1MB or less |

### Notes

- URLs must be absolute paths starting with `https://`
- It is recommended that `og:description` match `<meta name="description">`

## Twitter Card

In addition to OGP, set X (formerly Twitter) specific meta tags.

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@account_name" />
<meta name="twitter:title" content="Page Title" />
<meta name="twitter:description" content="Page description" />
<meta name="twitter:image" content="https://example.com/twitter-card.png" />
```

### Card Types

| Type | Description |
|------|-------------|
| `summary` | Small square image |
| `summary_large_image` | Large landscape image (recommended) |

## Web Manifest

Used for PWA support and icon settings when adding to the home screen.

### manifest.webmanifest

```json
{
  "name": "Site Name",
  "short_name": "Short Name",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/icon-maskable.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "theme_color": "#F7F6F3",
  "background_color": "#F7F6F3",
  "display": "standalone"
}
```

### Maskable Icon

Icons with `purpose: "maskable"` are displayed with a circular or other shape mask on Android and similar platforms.

| Item | Recommended Value |
|------|-------------------|
| Size | 512 x 512 px |
| Safe area | Place important elements within the center 80% |

### Implementation

```html
<link rel="manifest" href="/manifest.webmanifest" />
```

## Considerations for Logged-in / Logged-out States

OGP images and meta information may need to change dynamically based on the page state (e.g., whether the user is logged in).

| Scenario | Considerations |
|----------|----------------|
| Public pages | Use the standard OGP settings |
| Members-only pages | Set a generic OGP such as "Login required" |
| User-generated content | Generate OGP dynamically (server-side rendering) |

## File Structure

```
public/
├── favicon.png           # 48x48px
├── apple-touch-icon.png  # 180x180px
├── ogp.png              # 1200x630px
├── icon-192.png         # 192x192px
├── icon-512.png         # 512x512px
├── icon-maskable.png    # 512x512px (maskable)
└── manifest.webmanifest
```

## References

- [Google Favicon Guidelines](https://developers.google.com/search/docs/appearance/favicon-in-search?hl=ja)
- [Apple - Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
