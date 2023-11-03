import MarkdownItFootnote from 'markdown-it-footnote';
import { defineConfig } from "vitepress";
import { getHooksSidebar } from "../util/hooks";
import { getSidebarByPath } from "../util/nav";
import { getItems } from "../util/items"

var playerItems = getItems();
var hooks = getHooksSidebar();

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: "OxideMod",
  description: "Official documentation",
  srcDir: './docs',
  ignoreDeadLinks: true, //TODO: Remove for PR
  themeConfig: {
    logo: "/logo.png",
    
    editLink: {
      // pattern: 'https://github.com/oxidemod/oxide.docs/edit/master/docs/:path',
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
          items: [
            {
              text: "Development Guides",
              collapsed: false,
              items: [
                {text: "Getting Started", link: "/guides/developers/getting-started"},
                {text: "Getting Started V2", link: "/guides/developers/getting-started-v2"},
                {text: "Development Enviroment", link: "/guides/developers/development-enviroment"},
                {text: "My First Plugin", link: "/guides/developers/my-first-plugin"},
                {text: "My First Plugin V2", link: "/guides/developers/my-first-plugin-v2"},
                {text: "Plugin Guidelines", link: "/guides/developers/plugin-guidelines"},
                {text: "Best Practices", link: "/guides/developers/best-practices"},
                { 
                  text: "Using Oxide Libraries", 
                  collapsed: true,
                  items: [
                    {text: "Permissions", link: "/guides/developers/libraries/permissions"}
                  ]
                },
              ],
            },
          ]
          //items: getSidebarByPath("docs/guides/developers/")
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
          //items: getSidebarByPath("docs/core/"),
          items: [
            {
              text: "Commands",
              collapsed: false,
              link: "/core/commands/",
              items: [
                { text: "Plugin Commands", link: "/core/commands/pluginCommands"},
                { text: "Permission Commands", link: "/core/commands/permissionCommands"},
                { text: "Miscellaneous Commands", link: "/core/commands/miscellaneousCommands"}
              ],
            },
            {
              text: "Oxide Libraries",
              collapsed: false,
              link: "/core/libraries/",
              items: [
                { text: "Permissions", link: "/core/libraries/oxide/permissions" },
                { text: "Timers", link: "/core/libraries/oxide/timers" },
              ],
            },
            {
              text: "Items",
              link: "/core/items/",
              items: playerItems
            }
          ],
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
