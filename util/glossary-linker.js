#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import matter from 'gray-matter';

// Configuration
const GLOSSARY_FILE = path.join(process.cwd(), 'docs', 'glossary.md');
const DOCS_DIR = path.join(process.cwd(), 'docs');
const EXCLUDE_FILES = ['glossary.md', 'index.md']; // Files to exclude from processing
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
      while ((match = regex.exec(processedContent)) !== null) {
        const matchedTerm = match[0];
        const position = match.index;

        // Skip if we've already processed this position or nearby
        let shouldSkip = false;
        for (const pos of processedPositions) {
          if (Math.abs(pos - position) < matchedTerm.length * 2) {
            shouldSkip = true;
            break;
          }
        }

        if (shouldSkip) continue;

        // Skip if inside a code block, HTML tag, or other exclusion zone
        if (isInExcludedZone(processedContent, position)) {
          continue;
        }

        // Check if the term already has a glossary reference
        const nextChars = processedContent.substring(
          position + matchedTerm.length,
          position + matchedTerm.length + 30
        );
        if (nextChars.includes('<sup><a href="/glossary#')) {
          continue;
        }

        // Add the reference
        const reference = `<sup><a href="/glossary#${anchor}">[${index}]</a></sup>`;
        processedContent =
          processedContent.substring(0, position + matchedTerm.length) +
          reference +
          processedContent.substring(position + matchedTerm.length);

        // Update the regex lastIndex to avoid infinite loop due to the insertion
        regex.lastIndex = position + matchedTerm.length + reference.length;

        // Mark this position as processed
        processedPositions.add(position);
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

// Main function
async function main() {
  console.log('Extracting glossary terms...');
  const terms = extractGlossaryTerms();
  console.log(`Found ${terms.length} glossary terms`);

  if (terms.length === 0) {
    console.error('No glossary terms found, exiting.');
    process.exit(1);
  }

  console.log('Processing markdown files...');

  // Get command line args - if a specific file is provided, only process that
  const args = process.argv.slice(2);
  let filePatterns = ['**/*.md'];

  if (args.length > 0) {
    // If files are specified on command line, use those
    filePatterns = args;
    console.log(`Processing only specific files/patterns: ${filePatterns.join(', ')}`);
  }

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
