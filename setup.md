# Blog & CMS Setup Guide

This guide provides step-by-step instructions on running the CMS locally, deploying it live, and details on how to configure either **Decap CMS** (pre-installed, Git-based) or **Sanity CMS** (alternative cloud database).

---

## Table of Contents
1. [Decap CMS (Recommended Git-Based CMS)](#1-decap-cms-recommended-git-based-cms)
   - [How It Works](#how-it-works)
   - [Local Development Setup](#local-development-setup)
   - [Production Deployment (Netlify & Git Gateway)](#production-deployment-netlify--git-gateway)
   - [Alternative Production Deployment (Vercel & OAuth)](#alternative-production-deployment-vercel--oauth)
2. [Sanity CMS (Alternative Cloud-Based CMS)](#2-sanity-cms-alternative-cloud-based-cms)
   - [Why Sanity?](#why-sanity)
   - [Sanity Studio Setup](#sanity-studio-setup)
   - [Sanity Content Schema](#sanity-content-schema)
   - [Astro Integration Code](#astro-integration-code)
3. [Feature Comparison](#feature-comparison)

---

## 1. Decap CMS (Recommended Git-Based CMS)

### How It Works
Decap CMS is a single-page React app served from `public/admin/index.html`. It does not require any database. When you save content in the CMS:
1. It writes standard markdown files to `src/content/blog/` inside your repository.
2. It uploads images to `public/images/uploads/`.
3. Astro builds these static files during the build process, resulting in **zero-latency page loads** and **no API subscription fees**.

### Local Development Setup

To write and edit posts locally, you can use Decap's built-in local backend server proxy.

1. **Install and run the local CMS proxy:**
   Open a separate terminal tab in the project root and run:
   ```bash
   npx decap-cms-proxy
   ```
   *This starts a proxy server on port `8081` that intercepts writes and saves them directly to your filesystem.*

2. **Start the Astro development server:**
   In your main terminal, run:
   ```bash
   npm run dev
   ```
   *This runs your local development website on `http://localhost:4321/`.*

3. **Access the Admin Panel:**
   Go to **[http://localhost:4321/admin/](http://localhost:4321/admin/)** in your browser.
   - Because `local_backend: true` is configured in `public/admin/config.yml`, you will be logged in automatically.
   - Any changes you save here will create or modify markdown files in `src/content/blog/` in real-time.

---

### Production Deployment (Netlify & Git Gateway)

Netlify is the easiest platform for hosting Decap CMS because of its built-in identity management (Netlify Identity) and Git Gateway.

#### Step 1: Deploy your project to Netlify
1. Commit your codebase to a GitHub, GitLab, or Bitbucket repository.
2. Go to [Netlify](https://www.netlify.com/) and create a new site from your Git repository.
3. Configure the build command as `npm run build` and publish directory as `dist`.

#### Step 2: Enable Netlify Identity
1. In the Netlify dashboard, navigate to **Site configuration** > **Identity**.
2. Click **Enable Identity**.
3. Under **Registration preferences**, choose **Open** (anyone can sign up) or **Invite only** (only users you invite can sign up to edit your blog).
4. Scroll down to **External providers** and click **Add provider** to add GitHub login (optional).

#### Step 3: Enable Git Gateway
1. In the Netlify dashboard, scroll down to **Services** > **Git Gateway** under the Identity settings.
2. Click **Enable Git Gateway**.
3. Netlify will prompt you to authorize your Git provider (e.g., GitHub). Once authorized, Netlify will securely handle repository writes on behalf of authenticated CMS users.

#### Step 4: Finalize Netlify Identity Widget
In your `public/admin/index.html` file, the Netlify Identity widget scripts are already loaded. When you visit your live site's `/admin/` page:
- You will see a Login modal.
- Log in with the email credentials or the GitHub account you invited.
- Once authenticated, you will have access to publish blog posts.

---

### Alternative Production Deployment (Vercel & OAuth)

If you host your site on Vercel or Cloudflare Pages, you won't have access to Netlify's built-in Git Gateway. Instead, you need a custom OAuth provider to authorize GitHub login.

1. **Deploy your site to Vercel**: Connect your GitHub repository to Vercel and build it statically.
2. **Create a GitHub OAuth App**:
   - Go to GitHub Developer Settings > OAuth Apps > **New OAuth App**.
   - **Application Name**: `Portfolio CMS`
   - **Homepage URL**: `https://your-domain.vercel.app`
   - **Authorization callback URL**: `https://your-domain.vercel.app/callback`
   - Save and record the **Client ID** and **Client Secret**.
3. **Use an external OAuth server**:
   Since Decap CMS needs a server-side handler to exchange authorization codes, you can deploy a one-click serverless handler such as:
   - [Decap CMS OAuth Server on Vercel](https://github.com/decaporg/decap-cms-oauth-vercel)
   - [Svelte CMS Git Gateway / OAuth helper](https://github.com/sveltia/sveltia-cms-auth)
4. **Update `public/admin/config.yml`**:
   Replace the `backend` block with:
   ```yaml
   backend:
     name: github
     repo: your-github-username/your-repo-name
     branch: main
     base_url: https://your-oauth-server-url.vercel.app # URL of your deployed OAuth server
   ```

---

## 2. Sanity CMS (Alternative Cloud-Based CMS)

If you prefer a hosted database where content is retrieved dynamically via API queries rather than stored inside your Git repository, Sanity CMS is a strong choice.

### Why Sanity?
- Relational content schemas (e.g. linking authors to posts).
- Real-time collaborative editor interface (Sanity Studio).
- On-the-fly image manipulation API.

### Sanity Studio Setup

1. **Install the Sanity CLI globally:**
   ```bash
   npm install -g @sanity/cli
   ```
2. **Initialize a Sanity Studio in your workspace:**
   Create a separate folder for your studio or run init directly:
   ```bash
   sanity init
   ```
   - Select **Create new project**.
   - Choose the **Blog** template (or a clean schema).
   - Sanity will configure a Studio and output a `sanity.config.ts` and schema directories.
3. **Start the Studio locally:**
   ```bash
   cd sanity-studio-directory
   npm run dev
   ```
   *Your studio runs on `http://localhost:3333/` where you can create documents and publish them.*

### Sanity Content Schema

Ensure your Sanity post document contains fields matching the website expectations:
```javascript
// post.js schema in sanity
export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'pubDate', title: 'Publish Date', type: 'date' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'author', title: 'Author', type: 'string' },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'body', title: 'Body', type: 'markdown' }, // Requires the 'sanity-plugin-markdown' plugin
  ]
}
```

### Astro Integration Code

If you choose to switch from Decap to Sanity, you will replace Astro's static collections with Sanity client queries.

1. **Install the Astro Sanity integration:**
   ```bash
   npm install @sanity/client groq
   ```
2. **Configure Environment Variables:**
   Create a `.env` file in your root folder:
   ```env
   PUBLIC_SANITY_PROJECT_ID="your_project_id"
   PUBLIC_SANITY_DATASET="production"
   ```
3. **Replace `src/pages/blog/index.astro` fetch code:**
   ```astro
   ---
   import Header from "../../components/Header.astro";
   import Footer from "../../components/Footer.astro";
   import { siteConfig } from "../../config";
   import { createClient } from "@sanity/client";
   import groq from "groq";

   const client = createClient({
     projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
     dataset: import.meta.env.PUBLIC_SANITY_DATASET,
     useCdn: true,
     apiVersion: "2024-03-01",
   });

   const query = groq`*[_type == "post"] | order(pubDate desc)`;
   const posts = await client.fetch(query);
   ---
   <!-- Rest of your page renders posts items using post.title, post.description etc -->
   ```
4. **Replace `src/pages/blog/[slug].astro` fetch code:**
   ```astro
   ---
   import Header from "../../components/Header.astro";
   import Footer from "../../components/Footer.astro";
   import { createClient } from "@sanity/client";
   import groq from "groq";

   export async function getStaticPaths() {
     const client = createClient({
       projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
       dataset: import.meta.env.PUBLIC_SANITY_DATASET,
       useCdn: true,
       apiVersion: "2024-03-01",
     });
     
     const posts = await client.fetch(groq`*[_type == "post"]`);
     return posts.map((post) => ({
       params: { slug: post.slug.current },
       props: { post },
     }));
   }

   const { post } = Astro.props;
   // Use a package like markdown-it or marked to render post.body to HTML:
   // import { marked } from "marked";
   // const htmlContent = marked(post.body);
   ---
   <!-- Render content dynamically -->
   ```

---

## 3. Feature Comparison

| Feature | Decap CMS (Git-Based) | Sanity CMS (API-Based) |
| :--- | :--- | :--- |
| **Data Source** | Git Repository (Markdown) | Hosted Database |
| **API Latency** | **Zero** (Static during build) | Relies on CDN / Fetching |
| **Monthly Cost** | **$0** (Completely Free) | Generous Free Tier, then paid |
| **Media Storage** | Local Git Repo (LFS option) | Sanity CDN (Asset pipeline) |
| **Offline Setup** | Yes, via local proxy | No (Requires cloud connection) |
| **Collaborative Editing** | Push conflicts possible | Real-time google-docs style |
