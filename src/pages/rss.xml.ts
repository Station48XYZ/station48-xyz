import type { APIContext, APIRoute } from "astro";
import rss from '@astrojs/rss';
import { getCollection } from "astro:content";
import { filterDrafts } from "../lib/filters";

export const GET: APIRoute = async (context: APIContext) => {
    // Import the blog collection from the content collections
    const news = await getCollection('news');

    // Filter out drafts if necessary (optional, depending on your needs)
    const filteredNews = filterDrafts(news);

    // Generate the RSS feed using the imported blog collection
    return rss({
        title: 'Station48 News',
        description: 'A all Inclusive and Welcoming Community Minecraft Server for all Players, Devs and non-devs alike! We are a community of developers (Mostly Astro Devs), builders, and players who love to relax, create, and play Minecraft together.',
        site: context.url,
        items: filteredNews.map((post) => ({
            title: post.data.title,
            description: post.data.description,
            pubDate: post.data.date,
            link: `/news/${post.slug}`,
            author: 'StudioCMS'
        })),
    });
}