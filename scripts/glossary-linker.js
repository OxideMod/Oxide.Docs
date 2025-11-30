#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import matter from 'gray-matter';

// Configuration
const GLOSSARY_FILE = path.join(process.cwd(), 'docs', 'glossary.md');
const DOCS_DIR = path.join(process.cwd(), 'docs');
const EXCLUDE_FILES = ['glossary.md', 'index.md', 'skins.md']; // Files to exclude from processing
const EXCLUDE_SECTIONS = ['```', '~~~', '<code', '</code>']; // Sections to exclude (code blocks)

// Extract glossary terms and their anchors from the glossary file
function extractGlossaryTerms() {
  try {
    const content = fs.readFileSync(GLOSSARY_FILE, 'utf8');
    const { data, content: glossaryContent } = matter(content);

    const terms = [];
    const regex = /^### (.+)$/gm;
    let match;

    while ((match = regex.exec(glossaryContent)) !== null) {
      const term = match[1].trim();
      const anchor = term.toLowerCase().replace(/\s+/g, '-');
      terms.push({
        term,
        anchor,
        index: terms.length + 1, // Generate the reference index
      });
    }

    return terms;
  } catch (error) {
    console.error('Error reading glossary file:', error);
    return [];
  }
}

// Check if position is inside a code block, HTML tag, heading, or other exclusion zones
function isInExcludedZone(content, position) {
  // Check if in a heading
  // Look at the start of the line containing this position to see if it starts with #
  const lineStart = content.lastIndexOf('\n', position) + 1;
  const lineEnd = content.indexOf('\n', position);
  const currentLine = content.substring(lineStart, lineEnd !== -1 ? lineEnd : content.length);

  // Check if the line starts with one or more # characters (heading)
  if (/^#{1,6}\s/.test(currentLine.trim())) {
    return true;
  }

  // Check if in an import statement or JavaScript/TypeScript code
  if (
    /^import\s+|^export\s+|^from\s+|^const\s+|^let\s+|^var\s+|^function\s+|^class\s+/.test(
      currentLine.trim()
    )
  ) {
    return true;
  }

  // Check for fenced code blocks
  for (const marker of ['```', '~~~']) {
    const occurrences = [];
    let pos = -1;

    while ((pos = content.indexOf(marker, pos + 1)) !== -1 && pos < position) {
      occurrences.push(pos);
    }

    if (occurrences.length % 2 === 1) {
      return true;
    }
  }

  // Check for HTML code tags
  const lastOpenTag = content.lastIndexOf('<code', position);
  const lastCloseTag = content.lastIndexOf('</code>', position);

  if (lastOpenTag > lastCloseTag && lastOpenTag !== -1) {
    return true;
  }

  // Check for inline code with backticks
  let backtickCount = 0;
  let currentPos = 0;

  while (currentPos < position) {
    const nextBacktick = content.indexOf('`', currentPos);
    if (nextBacktick === -1 || nextBacktick >= position) {
      break;
    }
    backtickCount++;
    currentPos = nextBacktick + 1;
  }

  // If we have an odd number of backticks before our position, we're inside inline code
  if (backtickCount % 2 === 1) {
    return true;
  }

  // Check if we're inside bold text using both ** and __ markers
  for (const boldMarker of ['**', '__']) {
    let boldCount = 0;
    let boldPos = 0;

    while (boldPos < position) {
      const nextBold = content.indexOf(boldMarker, boldPos);
      if (nextBold === -1 || nextBold >= position) {
        break;
      }
      boldCount++;
      boldPos = nextBold + boldMarker.length;
    }

    // If we have an odd number of bold markers before our position, we're inside bold text
    if (boldCount % 2 === 1) {
      return true;
    }
  }

  // Check if inside any HTML tag
  // This is a simple heuristic that might not work for all cases, but should catch most
  const beforePosition = content.substring(0, position);
  const lastOpenBracket = beforePosition.lastIndexOf('<');
  const lastCloseBracket = beforePosition.lastIndexOf('>');

  if (lastOpenBracket > lastCloseBracket && lastOpenBracket !== -1) {
    return true;
  }

  // Check if inside a Vue directive or template
  // Common patterns like v-if, v-for, {{ }}, etc.
  // This is a simple check for {{ and }} pairs
  const lastOpenBrace = beforePosition.lastIndexOf('{{');
  const lastCloseBrace = beforePosition.lastIndexOf('}}');

  if (lastOpenBrace > lastCloseBrace && lastOpenBrace !== -1) {
    return true;
  }

  return false;
}

// Add glossary references to a markdown file
function addGlossaryReferences(filePath, terms) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const { data, content: markdownContent } = matter(content);
    let processedContent = markdownContent;

    // Sort terms by length (descending) so longer terms are processed first
    const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);

    // Used to track positions where we've already added references
    const processedPositions = new Set();

    for (const { term, anchor, index } of sortedTerms) {
      // Create a case-insensitive regex for the term
      // Make sure it's a whole word and not part of another word
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');

      let match;
      let occurrenceCount = 0;
      while ((match = regex.exec(processedContent)) !== null) {
        const matchedTerm = match[0];
        const position = match.index;

        // Only link the first occurrence per term per file
        if (occurrenceCount >= 1) {
          continue;
        }

        // Skip if we've already processed this exact position (but not nearby positions)
        let shouldSkip = false;
        for (const pos of processedPositions) {
          // Only skip if we're referring to exactly the same position
          // This is more lenient than the previous version which would skip nearby positions
          if (pos === position) {
            shouldSkip = true;
            break;
          }
        }

        if (shouldSkip) continue;

        // Skip if inside a code block, HTML tag, or other exclusion zone
        if (isInExcludedZone(processedContent, position)) {
          continue;
        }

        // Check if the term is already wrapped in a glossary link
        const windowStart = Math.max(0, position - 50);
        const windowEnd = Math.min(processedContent.length, position + matchedTerm.length + 50);
        const surrounding = processedContent.substring(windowStart, windowEnd);
        if (surrounding.includes('class="glossary-term"')) {
          continue;
        }

        // Add the reference: wrap the matched term with a glossary link (no numeric superscript)
        const wrapped = `<a href="/glossary#${anchor}" class="glossary-term">${matchedTerm}</a>`;
        processedContent =
          processedContent.substring(0, position) +
          wrapped +
          processedContent.substring(position + matchedTerm.length);

        // Update the regex lastIndex to avoid infinite loop due to the insertion
        regex.lastIndex = position + wrapped.length;

        // Mark this position as processed
        processedPositions.add(position);
        occurrenceCount += 1;
      }
    }

    // Reassemble the file with frontmatter
    const updatedContent = matter.stringify(processedContent, data);
    fs.writeFileSync(filePath, updatedContent);

    return true;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

// Remove all glossary references from a markdown file (unified remove mode)
function removeGlossaryReferences(filePath) {
  try {
    console.log(`Processing: ${path.relative(process.cwd(), filePath)}`);

    let content = fs.readFileSync(filePath, 'utf8');
    const { data, content: markdownContent } = matter(content);

    // Use comprehensive regexes to remove all glossary references
    // Standard format
    let processedContent = markdownContent.replace(
      /<sup><a href="\/glossary#[^"]+"\>\[[0-9]+\]<\/a><\/sup>/g,
      ''
    );

    // Handle special cases that may appear within home page markdown content
    processedContent = processedContent.replace(
      /plugin<sup><a\s+href="\/glossary#[^"]+"\>\[[0-9]+\]<\/a><\/sup>/g,
      'plugin'
    );
    processedContent = processedContent.replace(
      /hooks<sup><a\s+href="\/glossary#[^"]+"\>\[[0-9]+\]<\/a><\/sup>/g,
      'hooks'
    );
    processedContent = processedContent.replace(
      /permissions<sup><a\s+href="\/glossary#[^"]+"\>\[[0-9]+\]<\/a><\/sup>/g,
      'permissions'
    );
    processedContent = processedContent.replace(
      /extensions<sup><a\s+href="\/glossary#[^"]+"\>\[[0-9]+\]<\/a><\/sup>/g,
      'extensions'
    );

    // Remove superscripts inside glossary anchors while keeping the link (new format)
    // Pattern: <a ... href="/glossary#..." ...>TERM<sup>...</sup></a> → <a ...>TERM</a>
    processedContent = processedContent.replace(
      /(<a[^>]*href="\/glossary#[^"]+"[^>]*>)([\s\S]*?)(<sup[^>]*>[\s\S]*?<\/sup>)([\s\S]*?<\/a>)/g,
      (_m, p1, p2, _p3, p4) => `${p1}${p2}${p4}`
    );

    // Generic pattern (fallback) for glossary links
    processedContent = processedContent.replace(
      /<sup><a\s+href="\/glossary#[^"]+"\>\[[0-9]+\]<\/a><\/sup>/g,
      ''
    );

    // Reassemble the file with frontmatter
    const updatedContent = matter.stringify(processedContent, data);
    fs.writeFileSync(filePath, updatedContent);

    return true;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

// Main function
async function main() {
  // CLI modes:
  //   Default (no args): add references across docs
  //   Patterns (args): add references in specified files/patterns
  //   remove [patterns...]: remove references across docs or in specified patterns

  const args = process.argv.slice(2);

  // Removal mode
  if (args[0] === 'remove' || args[0] === '--remove' || args[0] === '-r') {
    console.log('Removing all glossary references from markdown files...');

    const patterns = args.length > 1 ? args.slice(1) : ['**/*.md'];
    const specificFileMode = args.length > 1;

    const files = globSync(patterns, {
      cwd: specificFileMode ? process.cwd() : DOCS_DIR,
      absolute: true,
    });

    console.log(`Found ${files.length} markdown files to process`);

    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      try {
        const success = removeGlossaryReferences(file);
        if (success) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error(`Error processing ${file}: ${error.message}`);
        errorCount++;
      }
    }

    console.log(`Successfully processed ${successCount} out of ${files.length} files`);
    if (errorCount > 0) {
      console.error(`Failed to process ${errorCount} files`);
      process.exit(1);
    }
    return;
  }

  // Add/link mode
  console.log('Extracting glossary terms...');
  const terms = extractGlossaryTerms();
  console.log(`Found ${terms.length} glossary terms`);

  if (terms.length === 0) {
    console.error('No glossary terms found, exiting.');
    process.exit(1);
  }

  console.log('Processing markdown files...');

  let filePatterns = ['**/*.md'];
  if (args.length > 0) {
    // If files/patterns are specified on command line, use those
    filePatterns = args;
    console.log(`Processing only specific files/patterns: ${filePatterns.join(', ')}`);
  }

  // Create an explicit list of excluded files with absolute paths for more reliable checking
  const absoluteExcludePaths = EXCLUDE_FILES.map(file => path.join(DOCS_DIR, file));

  const files = globSync(filePatterns, {
    cwd: args.length > 0 ? process.cwd() : DOCS_DIR,
    ignore: EXCLUDE_FILES,
    absolute: true,
  });

  console.log(`Found ${files.length} markdown files to process`);

  let successCount = 0;
  let errorFiles = [];

  for (const file of files) {
    try {
      // Skip the glossary file and other excluded files - use absolute path comparison
      if (absoluteExcludePaths.includes(path.resolve(file))) {
        console.log(`Skipping excluded file: ${path.relative(process.cwd(), file)}`);
        continue;
      }

      console.log(`Processing: ${path.relative(process.cwd(), file)}`);
      const success = addGlossaryReferences(file, terms);
      if (success) successCount++;
    } catch (error) {
      console.error(`Error processing ${file}: ${error.message}`);
      errorFiles.push(file);
    }
  }

  console.log(`Successfully processed ${successCount} out of ${files.length} files`);

  if (errorFiles.length > 0) {
    console.error('Errors encountered in the following files:');
    errorFiles.forEach(file => console.error(` - ${path.relative(process.cwd(), file)}`));
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
