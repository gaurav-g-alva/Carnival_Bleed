# Page Routing & Link Integration Guide

This guide explains the file-system-based routing architecture used in this Astro project, how dynamic blog paths are resolved, and how static pages link to section anchors.

---

## 1. Directory Structure & Page Routes

Astro uses a file-system-based routing system. Any file in the `src/pages/` directory becomes an HTML page on your built site.

```text
src/pages/
├── index.astro                 -->  / (Home page containing sections)
├── certifications.astro         -->  /certifications (Standalone credentials page)
└── blog/
    ├── index.astro             -->  /blog (Blog articles grid)
    └── [slug].astro            -->  /blog/[slug] (Dynamic article reader page)

public/
└── admin/
    └── index.html              -->  /admin (Decap CMS Single Page Application)
```

---

## 2. Homepage Section Anchors

The homepage (`src/pages/index.astro`) is a single-page structure composed of several modular sections. Each section has a specific HTML `id`:

| Section | Component Path | Anchor Target |
| :--- | :--- | :--- |
| **Hero** | `src/components/Hero.astro` | `#hero` |
| **About** | `src/components/About.astro` | `#about` |
| **Projects** | `src/components/Projects.astro` | `#projects` |
| **Experience** | `src/components/Experience.astro` | `#experience` |
| **Education** | `src/components/Education.astro` | `#education` |
| **Certifications** | `src/components/Certifications.astro` | `#certifications` |

---

## 3. Dynamic Blog Routing

Individual blog articles are stored as local Markdown files in `src/content/blog/` and dynamically rendered via `src/pages/blog/[slug].astro`.

### Generating Dynamic Paths (`[slug].astro`)
Astro compiles the site statically. To generate routes for all articles at build time, `getStaticPaths()` queries Astro's Content Collection:

```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post }, // Pass post data down as props
  }));
}

const { post } = Astro.props;
const { Content } = await post.render(); // Extract Markdown compiler Content
---

<!-- Render inside HTML body -->
<div class="blog-content">
  <Content /> <!-- Dynamic Markdown content injected here -->
</div>
```

---

## 4. Navigation & Link Resolution (Header/Footer)

To maintain a smooth user experience, navigation links (like *About*, *Projects*, etc.) must behave differently depending on the user's location:
1. **On the Home Page (`/`)**: Clicking a link should trigger browser smooth-scrolling to the section anchor (e.g., `#about`).
2. **On Subpages (`/blog`, `/blog/[slug]`, `/certifications`)**: Clicking a link must redirect back to the home page before scrolling to the section (e.g., `/#about`).

This is resolved inside `src/components/Header.astro` and `src/components/Footer.astro`:

### Page Context Detection Snippet

```astro
---
// Detect page context in Header/Footer frontmatter
const isHome = Astro.url.pathname === "/" || Astro.url.pathname === "/index.html";
const isBlog = Astro.url.pathname.startsWith("/blog");
const isCertifications = Astro.url.pathname.startsWith("/certifications");

const hasProjects = siteConfig.projects && siteConfig.projects.length > 0;
const hasCertifications = siteConfig.certifications && siteConfig.certifications.length > 0;
---
```

### Conditional Anchor Rendering Snippet

```astro
<!-- Navigation list elements render link target dynamically -->
<nav>
  <ul>
    <li>
      <a href={isHome ? "#about" : "/#about"}>About</a>
    </li>
    {
      hasProjects && (
        <li>
          <a href={isHome ? "#projects" : "/#projects"}>Projects</a>
        </li>
      )
    }
    {
      hasCertifications && (
        <li>
          <a 
            href={isHome ? "#certifications" : "/#certifications"}
            class={isCertifications ? "text-[var(--accent-color)] font-semibold" : "text-gray-700"}
          >
            Certifications
          </a>
        </li>
      )
    }
    <li>
      <a 
        href="/blog" 
        class={isBlog ? "text-[var(--accent-color)] font-semibold" : "text-gray-700"}
      >
        Blog
      </a>
    </li>
  </ul>
</nav>
```

---

## 5. Build Compilation Output

When you compile the project for deployment (`npm run build`), Astro outputs static HTML pages into the `dist/` directory:

```text
dist/
├── index.html                   (Home page with injected sections)
├── certifications/
│   └── index.html               (Standalone certifications listing)
├── blog/
│   ├── index.html               (Blog list)
│   ├── introducing-my-new-blog/
│   │   └── index.html           (Static built post)
│   └── mastering-tailwind-v4/
│       └── index.html           (Static built post)
├── sitemap-index.xml            (Generated sitemap indexing all routes)
└── robots.txt                   (Crawler configuration referencing sitemap)
```
