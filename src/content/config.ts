import { defineCollection, z } from "astro:content";

const newsCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
    })
});

export const collections = {
    news: newsCollection,
};