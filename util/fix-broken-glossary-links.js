#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import matter from 'gray-matter';

// Configuration
const DOCS_DIR = path.join(process.cwd(), 'docs');

// Function to remove all glossary references from a markdown file
function removeGlossaryReferences(filePath) {
  try {
    console.log(`Processing: ${path.relative(process.cwd(), filePath)}`);

    let content = fs.readFileSync(filePath, 'utf8');
    const { data, content: markdownContent } = matter(content);

    // Use more comprehensive regexes to remove all glossary references
    // First, the standard format:
    let processedContent = markdownContent.replace(
      /<sup><a href="\/glossary#[^"]+"\>\[[0-9]+\]<\/a><\/sup>/g,
      ''
    );

    // Second, handle the format in home page markdown content
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

    // Handle any other case - more generic pattern for glossary links within home page YAML blocks
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
  console.log('Removing all glossary references from markdown files...');

  const args = process.argv.slice(2);
  let filePatterns = ['**/*.md'];
  let specificFileMode = false;

  if (args.length > 0) {
    filePatterns = args;
    specificFileMode = true;
    console.log(`Processing only specific files/patterns: ${filePatterns.join(', ')}`);
  }

  const files = globSync(filePatterns, {
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
  }
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
