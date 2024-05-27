import { defineConfig } from 'astro/config';
import minecraftStyles from 'astrocraft/unocss';
import mcServerStatus from '@matthiesenxyz/astro-mcserverstatus';
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: "https://studio48.xyz",
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [
    mdx(), 
    minecraftStyles(), 
    mcServerStatus({
        serverAddress: "play.station48.xyz",
        javaOptions: {
            query: true,
        },
        verbose: true,
    })
  ]
});