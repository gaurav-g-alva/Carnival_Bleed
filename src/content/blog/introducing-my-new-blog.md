---
title: "Introducing My New Portfolio & Blog"
pubDate: "2026-06-10"
description: "Welcome to my new developer portfolio! In this post, I'll walk you through the tech stack used to build this site and why I chose Astro and Decap CMS."
author: "Ryan Fitzgerald"
tags: ["Astro", "TailwindCSS", "DecapCMS", "WebDev"]
---

Welcome to my new personal developer portfolio and blog! 

I recently rebuilt this site to make it cleaner, faster, and much easier to maintain. Here is a quick dive into the architecture and setup.

## The Tech Stack

This site is built with a highly modern and lightweight tech stack:

- **Astro**: A static-site builder optimized for speed. It delivers zero client-side JavaScript by default, rendering HTML on the server and only hydrating components when necessary.
- **Tailwind CSS v4**: For fast, responsive styling using CSS custom properties and standard utility classes.
- **Decap CMS**: A Git-based Content Management System (formerly Netlify CMS) that runs entirely in the browser and saves articles directly to my Git repository.

## Why a Git-Based CMS?

Traditional headless CMS platforms like Sanity, Contentful, or Strapi are great, but they come with trade-offs:
1. **Latency**: Builds or client-side renders require fetching data over an API.
2. **Cost**: They often have usage limits or paid tiers.
3. **Database Dependency**: Content is stored in an external database, which can be a single point of failure.

Decap CMS, on the other hand, is Git-based. When I write a post:
1. It writes a standard Markdown file directly to `src/content/blog/` in my GitHub repository.
2. The change triggers a deployment pipeline (e.g. on Netlify or Vercel).
3. The site rebuilds statically.

This means the site remains 100% static, loads instantly, and runs completely free with zero API latency.

## What's Next?

I plan to use this space to share articles about software engineering, frontend performance, and serverless architectures. 

Stay tuned for more updates!
