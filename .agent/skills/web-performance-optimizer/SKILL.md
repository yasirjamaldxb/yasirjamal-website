---
name: web-performance-optimizer
description: Comprehensive skill and toolkit for auditing, benchmarking, and optimizing websites for 100/100 Google PageSpeed Insights, sub-500ms Core Web Vitals, and zero-blocking frontend engineering.
---

# Web Performance & PageSpeed Optimizer Skill

Use this skill to diagnose, benchmark, and engineer sub-second website speed, 100/100 Google PageSpeed Insights scores, and flawless Core Web Vitals (FCP, LCP, CLS, TBT, INP).

---

## 1. Quick Audit Commands

Run Google PageSpeed Insights directly against any live URL:

```bash
# Audit Mobile Performance
node scripts/pagespeed.js https://yasirjamal.com/ mobile

# Audit Desktop Performance
node scripts/pagespeed.js https://yasirjamal.com/ desktop
```

---

## 2. Core Web Vitals Benchmarking Targets

Metric | Target (Good) | Description
:--- | :--- | :---
**LCP** (Largest Contentful Paint) | `< 1.2s` | Render time of the largest visible content block (hero heading/image).
**FCP** (First Contentful Paint) | `< 0.8s` | Time until the first DOM content (text/canvas/image) appears.
**TBT** (Total Blocking Time) | `< 50ms` | Total time main thread is blocked by JavaScript execution.
**CLS** (Cumulative Layout Shift) | `0.00` | Visual stability score (zero unexpected layout shifts).
**INP** (Interaction to Next Paint) | `< 100ms` | Responsiveness to user interactions (clicks, taps, typing).

---

## 3. High-Impact Speed Optimization Rules

1. **Zero Render-Blocking Stylesheets**:
   - Asynchronously load non-critical CSS / Google Fonts using `<link rel="preload" as="style" ... onload="this.media='all'" />`.
2. **Non-Blocking Deferred Analytics**:
   - Always load third-party scripts (GA4, Ads, Heatmaps) on `requestIdleCallback` or first user interaction (`scroll`, `touchstart`).
3. **Canvas & Animation Throttling**:
   - Always wrap continuous canvas render loops in `IntersectionObserver` to pause rendering when elements leave the viewport.
4. **1-Year Immutable Caching**:
   - Configure `.htaccess` or CDN headers with `Cache-Control: max-age=31536000, public, immutable` on all static assets.
5. **Modern Media Formats**:
   - Serve images in WebP or AVIF with explicit `width` and `height` dimensions to prevent CLS.
