import type { CollectionEntry } from "astro:content";

export function filterDrafts(posts: CollectionEntry<'news'>[]) {
    return posts.filter(post => !post.data.draft);
}