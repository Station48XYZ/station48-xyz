import { defineConfig } from 'astro/config';
import minecraftStyles from 'astrocraft/unocss';
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import transformerDirectives from '@unocss/transformer-directives'

// https://astro.build/config
export default defineConfig({
  site: "https://station48.xyz",
  output: "server",
  adapter: node({ mode: "standalone" }),
  image: {
    remotePatterns: [
      {
        protocol: "https"
      }
    ]
  },
  integrations: [
    mdx(),
    minecraftStyles({
      transformers: [transformerDirectives()]
    }),
  ]
});