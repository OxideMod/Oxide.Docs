import MarkdownItFootnote from 'markdown-it-footnote';
import { defineConfig } from "vitepress";
import { getHooksSidebar } from "../util/hooks";
import { getSidebarByPath } from "../util/nav";
import { getItemSkins } from "../util/items"

var itemSkins = getItemSkins();
var hooks = getHooksSidebar();

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: "OxideMod",
  description: "Official documentation",
  srcDir: './docs',
  ignoreDeadLinks: true, //TODO: Remove for PR
  cleanUrls: true,
  themeConfig: {
    logo: "/logo.png",
    
    editLink: {
      pattern: ({ filePath }) => {
        if (filePath.startsWith('hooks/')) {
          filePath = filePath.replace('hooks/', 'hooks/overwrites/')
        }
        return `https://github.com/oxidemod/oxide.docs/edit/master/docs/${filePath}`
      },
      text: 'Edit this page on GitHub'
    },

    search: {
      provider: 'local'
    },
    
    nav: [
      { text: "Home", link: "/" },
      {
        text: "Guides",
        items: [
          { text: "Server Owners", link: "/guides/owners/getting-started" },
          {
            text: "Plugin Developers",
            link: "/guides/developers/getting-started",
          },
        ],
      },
      { text: "Core", link: "/core/" },
      { text: "Hooks", link: "/hooks/" },
    ],

    sidebar: {
      "/guides/developers/": [
        {
          text: "Developer Guides",
          items: getSidebarByPath("docs/guides/developers/")
        },
      ],
      "/guides/owners/": [
        {
          text: "Server Owner Guides",
          items: getSidebarByPath("docs/guides/owners/"),
        },
      ],
      "/guides/reviewers/": [
        {
          text: "Plugin Reviewer Guides",
          items: getSidebarByPath("docs/guides/reviewers/"),
        },
      ],
      "/core/": [
        {
          text: "Core Documentation",
          items: getSidebarByPath("docs/core/"),
        },
      ],
      "/hooks/": [
        {
          text: "Hooks",
          items: hooks
        }
      ],
    },

    socialLinks: [
      { icon: "discord", link: "https://discord.gg/oxide" },
      { icon: "github", link: "https://github.com/oxidemod" },
      { icon: "twitter", link: "https://twitter.com/oxidemod" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2023-present OxideMod",
    },
  },
  markdown: {
    config(md) {
        md.use(MarkdownItFootnote);
    }
  }
});
