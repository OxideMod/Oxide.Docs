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
  lastUpdated: true,
  themeConfig: {
    logo: "/logo.png",
    externalLinkIcon: true,
    
    editLink: {
      pattern: ({ filePath }) => {
        if (filePath.startsWith('hooks/')) {
          filePath = filePath.replace('hooks/', 'hooks/overwrites/')
        }
        return `https://github.com/oxidemod/oxide.docs/edit/main/docs/${filePath}`
      },
      text: 'Edit this page on GitHub'
    },

    search: {
      provider: 'algolia',
      options: {
        appId: 'BMU00HK1M4',
        apiKey: '7089bd6cc05b7151c6ed5741f86203b3',
        indexName: 'oxidemod',
      }
    }, 

    nav: [
      { text: "Guides", link: "/guides/" },
      { text: "Core", link: "/core/" },
      { text: "Hooks", link: "/hooks/" },
    ],

    sidebar: {
      "/guides/": [
        {
          text: "Server Owners",
          collapsed: false,
          items: getSidebarByPath("docs/guides/owners/"),
        },
        {
          text: "Developers",
          collapsed: false,
          items: getSidebarByPath("docs/guides/developers/")
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
          text: "Commands",
          collapsed: false,
          items: getSidebarByPath("docs/core/commands/"),
        },
        {
          text: "Libraries",
          collapsed: false,
          items: getSidebarByPath("docs/core/libraries/"),
        }
      ],
      "/hooks/": [
        {
          // text: "Hooks",
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
