import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: "OxideMod",
  description: "Official documentation",
  themeConfig: {
    logo: "/logo.png",
    // https://vitepress.dev/reference/default-theme-config

    nav: [
      { text: "Home", link: "/" },
      { text: "Guides",
        items: [
          { text: 'Server Owners', link: '/guides/owners/' },
          { text: 'Plugin Developers', link: '/guides/developers/' }
        ]
      },
      { text: "Core", link: "/core/" },
      { text: "Hooks", link: "/hooks/" },
    ],

    sidebar: {
      "/guides/": [
        {
          text: "Guides",
          items: [{ text: "Index", link: "/guides/" }],
        },
      ],
      "/core/": [
        {
          text: "Core Documentation",
          collapsed: false,
          items: [
            {
              text: "Index",
              link: "/core/",
              items: [
                { text: "Index", link: "/core/" },
                { text: "Core", link: "/core/core" },
              ],
            },
          ],
        },
        {
          text: "Permission",
          collapsed: false,
          items: [
            {
              text: "Index",
              link: "/core/",
              items: [
                { text: "Index", link: "/core/" },
                { text: "Core", link: "/core/core" },
              ],
            },
          ],
        },
      ],
      "/hooks/": [
        {
          text: "Category 1",
          collapsed: false,
          items: [
            { text: "Hook 1", link: "/hooks/1" },
            { text: "Hook 2", link: "/hooks/2" },
            { text: "Hook 3", link: "/hooks/3" },
            { text: "Hook 4", link: "/hooks/4" },
          ],
        },
        {
          text: "Category 2",
          collapsed: false,
          items: [
            { text: "Hook 1", link: "/hooks/1" },
            { text: "Hook 2", link: "/hooks/2" },
            { text: "Hook 3", link: "/hooks/3" },
            { text: "Hook 4", link: "/hooks/4" },
          ],
        },
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
