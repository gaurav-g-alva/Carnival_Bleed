// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://yourportfolio.com", // Replace with your actual domain name for production builds
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
