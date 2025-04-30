/**
 * Utility for automatically linking glossary terms in markdown content
 */

// List of terms to autolink to the glossary
// Add terms in lowercase for case-insensitive matching
export const glossaryTerms = [
  // Core Concepts
  { term: 'oxide', url: '/glossary#oxide' },
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
  { term: 'data files', url: '/glossary#data-files' },

  // Security & Management
  { term: 'permissions', url: '/glossary#permissions' },
  { term: 'groups', url: '/glossary#groups' },
];

/**
 * Converts glossary terms in a string to linked terms
 * @param content - The content to process
 * @param options - Processing options
 * @returns The processed content with linked terms
 */
export function linkGlossaryTerms(
  content: string,
  options: {
    excludeCodeBlocks?: boolean;
    currentPath?: string;
  } = {}
) {
  const { excludeCodeBlocks = true, currentPath = '' } = options;

  // Skip processing on the glossary page itself to prevent duplicate links
  if (currentPath.includes('glossary')) {
    return content;
  }

  if (excludeCodeBlocks) {
    // Split content by code blocks to avoid replacing inside code
    const parts = content.split(/(```[\s\S]*?```|`[^`]*`)/g);

    return parts
      .map((part, index) => {
        // Skip code blocks (odd indices in the parts array)
        if (index % 2 === 1) return part;

        // Skip processing headers (lines starting with #)
        const lines = part.split('\n');
        const processedLines = lines.map(line => {
          if (line.trim().startsWith('#')) {
            return line;
          }
          return replaceTerms(line);
        });

        return processedLines.join('\n');
      })
      .join('');
  }

  return replaceTerms(content);
}

/**
 * Helper to replace terms in a string with linked versions
 */
function replaceTerms(text: string): string {
  let result = text;

  // Process terms in reverse order of length to handle nested terms correctly
  // (e.g., "internal hooks" should be processed before "hooks")
  const sortedTerms = [...glossaryTerms].sort((a, b) => b.term.length - a.term.length);

  sortedTerms.forEach(({ term, url }) => {
    // Escape special regex characters in the term
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Use word boundary for whole word matching
    // Don't match inside HTML tags or existing links
    // Case insensitive match with i flag
    const regex = new RegExp(`\\b${escapedTerm}\\b(?![^<]*>|[^<>]*<\\/a>)`, 'gi');

    // Replace all occurrences, preserving case
    result = result.replace(regex, match => `[${match}](${url})`);
  });

  return result;
}

export default {
  linkGlossaryTerms,
};
