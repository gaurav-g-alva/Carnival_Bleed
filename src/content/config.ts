import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const settings = defineCollection({
  type: "data",
  schema: z.any(),
});

export const collections = { blog, settings };
