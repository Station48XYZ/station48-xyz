import { defineConfig } from 'astro/config';
import minecraftStyles from 'astrocraft/unocss';
import mcServerStatus from '@matthiesenxyz/astro-mcserverstatus';
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import transformerDirectives from '@unocss/transformer-directives'

// https://astro.build/config
export default defineConfig({
  site: "https://station48.xyz",
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [
    mdx(), 
    minecraftStyles({
      transformers: [transformerDirectives()]
    }), 
    mcServerStatus({
        serverAddress: "play.station48.xyz",
        javaOptions: {
            query: true,
        },
        verbose: true,
    })
  ]
});