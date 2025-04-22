import MarkdownItFootnote from 'markdown-it-footnote';
import { defineConfig, HeadConfig } from "vitepress";
import { getHooksSidebar } from "../util/hooks";
import { getSidebarByPath } from "../util/nav";

var hooks = getHooksSidebar();

const umamiScript: HeadConfig = ["script", {
  defer: "true",
  src: "https://um.oxidemod.com/script.js",
  "data-website-id": "28a8b6b5-bf7b-481b-bdc5-f4dafeb0a796"
}]

const logoStyle: HeadConfig = ["style", {}, `
  :root {
    --vp-nav-logo-height: 60px !important;
  }
  .VPNavBarTitle .VPImage {
    height: 60px !important;
    width: auto !important;
    max-height: 60px !important;
  }
`]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: "OxideMod",
  description: "Official documentation",
  srcDir: './docs',
  ignoreDeadLinks: true, //TODO: Remove for PR
  cleanUrls: true,
  lastUpdated: true,
  appearance: 'dark',
  themeConfig: {
    logo: {
      light: "/oxide_white_bg.svg",
      dark: "/oxide_black_bg.svg",
      alt: "OxideMod",
      height: 48
    },
    siteTitle: false,
    externalLinkIcon: false,
    
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
      { text: "← Back to OxideMod", link: "https://oxidemod.com/" },
      { text: "Guides", link: "/guides/" },
      { text: "Core", link: "/core/" },
      { text: "Hooks", link: "/hooks/" },
      { text: "Glossary", link: "/glossary" },
    ],

    sidebar: {
      "/guides/": [
        {
          text: "Server Owners",
          collapsed: false,
          items: [
            // Filter out community-related files from server owners section
            ...getSidebarByPath("docs/guides/owners/").filter(item => 
              !["community-guidelines", "contributing", "reporting-issues"].includes(
                item.link.split('/').pop()?.replace('.html', '') || ''
              )
            )
          ],
        },
        {
          text: "Developers",
          collapsed: false,
          items: getSidebarByPath("docs/guides/developers/")
        },
        {
          text: "Community",
          collapsed: false,
          items: [
            { text: "Community Guidelines", link: "/guides/owners/community-guidelines" },
            { text: "Contributing", link: "/guides/owners/contributing" },
            { text: "Reporting Issues", link: "/guides/owners/reporting-issues" },
          ]
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
  head: [umamiScript, logoStyle, ['link', { rel: 'stylesheet', href: '/theme/custom.css' }]],
  markdown: {
    config(md) {
      md.use(MarkdownItFootnote);
    }
  }
});
