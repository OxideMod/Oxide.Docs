/**
 * Glossary terms to autolink. Consumed by the markdown-it plugin in
 * util/glossary-md-plugin.js (wired up in .vitepress/config.ts).
 */

// Add terms in lowercase for case-insensitive matching
export const glossaryTerms = [
  // Core Concepts
  { term: 'covalence', url: '/glossary#covalence' },
  { term: 'extensions', url: '/glossary#extensions' },
  { term: 'plugins', url: '/glossary#plugins' },

  // Plugin Development
  { term: 'covalenceplugin', url: '/glossary#covalenceplugin' },
  { term: 'rustplugin', url: '/glossary#rustplugin' },
  { term: 'internal hooks', url: '/glossary#internal-hooks' },
  { term: 'hooks', url: '/glossary#hooks' },

  // Data & Configuration
  { term: 'json', url: '/glossary#json' },
  { term: 'config files', url: '/glossary#config-files' },
  { term: 'configuration files', url: '/glossary#config-files' },
  { term: 'data files', url: '/glossary#data-files' },

  // Security & Management
  { term: 'permissions', url: '/glossary#permissions' },
  { term: 'groups', url: '/glossary#groups' },
];
