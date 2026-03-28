---
name: seo-and-meta
description: Use when adding SEO meta tags, Open Graph tags, Twitter Cards, structured data (JSON-LD), canonical URLs, social media link previews, or improving search engine visibility for a React SPA on Vercel
---

# SEO & Meta Tags for React SPAs on Vercel

## Overview

SPAs serve a minimal HTML shell by default — crawlers and social-media link scrapers do not execute JavaScript. Every meta tag that matters for SEO and social previews must be present in the **static HTML** or injected server-side before it reaches the client.

## Static Meta Tags in index.html

Every SPA must have baseline meta tags in `index.html`. These are the minimum for social sharing and search engines.

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Primary SEO -->
  <title>Page Title — Brand</title>
  <meta name="description" content="Concise description under 155 characters." />
  <link rel="canonical" href="https://example.com/" />

  <!-- Open Graph (Facebook, LinkedIn, Discord, Slack) -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Page Title" />
  <meta property="og:description" content="Same or slightly longer than meta description." />
  <meta property="og:url" content="https://example.com/" />
  <meta property="og:image" content="https://example.com/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter / X Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Page Title" />
  <meta name="twitter:description" content="Concise description." />
  <meta name="twitter:image" content="https://example.com/og-image.png" />
</head>
```

## Quick Reference: Essential Meta Tags

| Tag | Purpose | Required |
|-----|---------|----------|
| `<title>` | Browser tab + search result headline | Yes |
| `meta[name=description]` | Search result snippet, 50-155 chars | Yes |
| `link[rel=canonical]` | Prevents duplicate-content penalties | Yes |
| `og:title` | Social share headline | Yes |
| `og:description` | Social share description | Yes |
| `og:image` | Social share image, 1200x630 px | Yes |
| `og:url` | Canonical URL for the shared page | Yes |
| `og:type` | Content type, usually `website` | Yes |
| `twitter:card` | `summary_large_image` for large preview | Yes |
| `twitter:image` | Falls back to `og:image` if omitted | No |
| `meta[name=robots]` | Control indexing (`index, follow`) | No |

## Client-Side Meta Tags with react-helmet-async

For route-specific meta tags on the client side, use `react-helmet-async` (v3+ supports React 19 natively).

```bash
npm install react-helmet-async
```

```tsx
// main.tsx — wrap with HelmetProvider
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

// Any page component
import { Helmet } from 'react-helmet-async';

function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About — Brand</title>
        <meta name="description" content="Learn more about us." />
        <link rel="canonical" href="https://example.com/about" />
        <meta property="og:title" content="About — Brand" />
        <meta property="og:url" content="https://example.com/about" />
      </Helmet>
      <main>{/* page content */}</main>
    </>
  );
}
```

**Important:** Client-side Helmet updates are visible to users and search engines that execute JS (Google), but social-media crawlers (Facebook, X, LinkedIn) do **not** run JS. For social previews to work on per-route pages, you need server-side injection (see below).

## Dynamic OG Tags with Vercel Serverless Functions

For per-route social previews, use placeholder replacement in a Vercel serverless function.

### Step 1 — Add placeholders to index.html

```html
<meta property="og:title" content="__OG_TITLE__" />
<meta property="og:description" content="__OG_DESCRIPTION__" />
<meta property="og:image" content="__OG_IMAGE__" />
<meta property="og:url" content="__OG_URL__" />
```

### Step 2 — Create api/og.js serverless function

```js
import { readFileSync } from 'fs';
import { join } from 'path';

const META = {
  '/': { title: 'Home — Brand', description: 'Welcome.', image: '/og-home.png' },
  '/about': { title: 'About — Brand', description: 'Our story.', image: '/og-about.png' },
};

export default function handler(req, res) {
  const path = new URL(req.url, `https://${req.headers.host}`).pathname;
  const meta = META[path] || META['/'];
  const base = `https://${req.headers.host}`;

  let html = readFileSync(join(process.cwd(), 'dist', 'index.html'), 'utf-8');
  html = html.replace(/__OG_TITLE__/g, meta.title);
  html = html.replace(/__OG_DESCRIPTION__/g, meta.description);
  html = html.replace(/__OG_IMAGE__/g, `${base}${meta.image}`);
  html = html.replace(/__OG_URL__/g, `${base}${path}`);

  res.setHeader('Content-Type', 'text/html');
  res.end(html);
}
```

### Step 3 — Update vercel.json

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/api/og" }
  ]
}
```

Static assets (`*.js`, `*.css`, images) are served automatically before rewrites apply.

## Vercel OG Image Generation

Generate dynamic social card images on the fly with `@vercel/og`.

```bash
npm install @vercel/og
```

```tsx
// api/og-image.tsx
import { ImageResponse } from '@vercel/og';

export default async function handler(req) {
  const { searchParams } = new URL(req.url, `https://${req.headers.host}`);
  const title = searchParams.get('title') || 'Default Title';

  return new ImageResponse(
    (
      <div style={{
        display: 'flex', width: '100%', height: '100%',
        background: '#1a1715', color: '#f5f0eb',
        fontSize: 60, padding: '60px 80px',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {title}
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
```

Reference it in your OG tags: `<meta property="og:image" content="https://example.com/api/og-image?title=Hello" />`

## JSON-LD Structured Data

Add structured data so search engines can generate rich results. Google recommends JSON-LD. In React, use a dedicated component with a script tag. Note: the content passed to the script tag must be developer-controlled data, never unsanitized user input.

```tsx
function StructuredData({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Safe: only serializing developer-controlled schema.org objects
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Usage
<StructuredData data={{
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Brand',
  url: 'https://example.com',
  description: 'A short description of the site.',
}} />
```

Common schema types: `WebSite`, `Organization`, `Product`, `Article`, `FAQPage`, `BreadcrumbList`.

## Canonical URLs and Vercel Duplicate Content

Vercel projects are accessible at both `your-app.vercel.app` and your custom domain. Without a canonical URL, search engines treat these as duplicate content.

**Always** set `<link rel="canonical">` to your custom domain. You can also add headers in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Robots-Tag", "value": "index, follow" }
      ]
    }
  ]
}
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Meta tags only in React components, not in HTML | Social crawlers skip JS — put defaults in `index.html` |
| Relative `og:image` URL | Must be absolute: `https://example.com/image.png` |
| Missing `og:image` dimensions | Add `og:image:width` (1200) and `og:image:height` (630) |
| Same title/description on every page | Use react-helmet-async for per-route overrides |
| No canonical URL | Causes duplicate-content penalties on Vercel |
| OG image too small or wrong ratio | Use exactly 1200x630 px (1.91:1 ratio) |
| Forgetting `twitter:card` | Without it, X shows a plain link with no image preview |
| Blocking `/api/og*` in robots.txt | Social crawlers need access to your OG image endpoint |
| Testing only in browser | Use Facebook Sharing Debugger, X Card Validator, and Google Rich Results Test |
