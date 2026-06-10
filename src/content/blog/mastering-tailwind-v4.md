---
title: "Mastering Tailwind CSS v4 in Astro"
pubDate: "2026-06-11"
description: "A deep dive into Tailwind CSS v4 features, including the new Vite integration, CSS-first configuration, and custom properties."
author: "Ryan Fitzgerald"
tags: ["TailwindCSS", "Astro", "CSS"]
---

Tailwind CSS v4 introduces a massive revamp of the utility-first CSS framework. It is faster, features a CSS-first configuration system, and works out-of-the-box with Vite.

In this post, we'll examine how Tailwind v4 is integrated into this portfolio template and how you can make the most of it.

## What's New in Tailwind v4?

### 1. Vite Plugin Integration
Instead of relying on a complex `tailwind.config.js` and PostCSS setup, Tailwind v4 uses the `@tailwindcss/vite` plugin. In Astro, this is configured directly in `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwind()],
  },
});
```

This makes build times significantly faster.

### 2. CSS-First Configuration
Instead of configuring colors, fonts, and utilities in JavaScript, configuration now happens directly inside your main CSS file (`src/styles/global.css`) using CSS variables:

```css
@import "tailwindcss";

@theme {
  --color-brand-blue: #1d4ed8;
  --font-mono: 'IBM Plex Mono', monospace;
}
```

Tailwind automatically registers these variables as utility classes (e.g. `bg-brand-blue` or `font-mono`).

## Customizing this Portfolio

This portfolio site reads an `accentColor` from `src/config.ts` and sets it on the HTML element dynamically. For instance, in our main layout, we can set:

```html
<div style={`--accent-color: ${siteConfig.accentColor}`}>
  <span class="text-[var(--accent-color)]">Colored Text</span>
</div>
```

This combines the power of Tailwind utility classes with dynamic, config-driven styles!
