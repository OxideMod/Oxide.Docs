import { defineConfig } from "vitepress";
import { getHooksSidebar } from "../util/hooks";
import { getSidebarByPath } from "../util/nav";

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
      "/core/": [
        {
          text: "Core Documentation",
          items: [
            {
              text: "Libraries",
              collapsed: false,
              link: "/core/libraries/",
              items: [
                { text: "Permissions", link: "/core/libraries/permissions" },
                { text: "Webrequests", link: "/core/libraries/webrequests" },
                { text: "Databases", link: "/core/libraries/databases" },
                { text: "Covalence", link: "/core/libraries/covalence" },
                { text: "Rust Cui", link: "/core/libraries/rust-cui" },
              ],
            },
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
      { icon: "discord", link: "https://discord.gg/HdhSD8aBXD" },
      { icon: "github", link: "https://github.com/oxidemod" },
      { icon: "twitter", link: "https://twitter.com/oxidemod" },
    ],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2023-present OxideMod",
    },
  },
});
