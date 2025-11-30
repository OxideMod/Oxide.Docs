<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vitepress';
import { glossaryTerms } from '../../../util/terms';

const route = useRoute();
const loaded = ref(false);

onMounted(() => {
  // Skip processing on the glossary page
  if (route.path.includes('/glossary')) return;

  // Only run this once
  if (loaded.value) return;
  loaded.value = true;

  // Process terms in order of length (longest first) to handle nested terms
  const sortedTerms = [...glossaryTerms].sort((a, b) => b.term.length - a.term.length);

  // Find the main content container
  const contentEl = document.querySelector('.vp-doc');
  if (!contentEl) return;

  // Check if the page already has processed glossary terms
  const existingLinks = contentEl.querySelectorAll('a[href^="/glossary#"]');
  if (existingLinks.length > 0) {
    // If we already have glossary links, do not process further
    // This prevents double-processing on page refresh
    return;
  }

  // Wait a bit for the page to fully render
  setTimeout(() => {
    // Process text nodes
    processTextNodes(contentEl, sortedTerms);
  }, 100);
});

function processTextNodes(element, terms) {
  // Skip processing for these elements
  if (
    element.tagName === 'CODE' ||
    element.tagName === 'PRE' ||
    element.tagName === 'A' ||
    element.tagName === 'SCRIPT' ||
    element.tagName === 'STYLE' ||
    element.tagName?.match(/^H[1-6]$/) ||
    element.classList?.contains('no-glossary')
  ) {
    return;
  }

  // Process child nodes first
  Array.from(element.childNodes).forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      processTextNodes(node, terms);
    } else if (node.nodeType === Node.TEXT_NODE) {
      processTextNode(node, terms);
    }
  });
}

function processTextNode(node, terms) {
  const content = node.textContent;
  if (!content || content.trim() === '') return;

  let fragments = [];
  let lastIndex = 0;
  let changed = false;
  const linkedTerms = new Set(); // ensure first occurrence per term per page

  for (const { term, url } of terms) {
    // Create a case-insensitive regular expression with word boundaries
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');

    let match;
    // Reset lastIndex before each term search
    regex.lastIndex = 0;
    let searchStart = 0;

    while ((match = regex.exec(content.substring(searchStart))) !== null) {
      if (linkedTerms.has(term)) {
        // Skip additional occurrences of this term within the page
        searchStart = match.index + searchStart + match[0].length;
        continue;
      }
      changed = true;
      const absoluteIndex = match.index + searchStart;

      // Add text before match
      if (absoluteIndex > lastIndex) {
        fragments.push(document.createTextNode(content.substring(lastIndex, absoluteIndex)));
      }

      // Create link for match with class for styling
      const link = document.createElement('a');
      link.href = url;
      link.classList.add('glossary-term');
      link.textContent = content.substring(absoluteIndex, absoluteIndex + match[0].length);

      link.setAttribute('title', `Glossary: ${term}`);
      fragments.push(link);

      lastIndex = absoluteIndex + match[0].length;
      searchStart = lastIndex;
      linkedTerms.add(term);
    }
  }

  // Add remaining text
  if (lastIndex < content.length) {
    fragments.push(document.createTextNode(content.substring(lastIndex)));
  }

  // Replace node if we made changes
  if (changed && fragments.length > 0) {
    const frag = document.createDocumentFragment();
    fragments.forEach(f => frag.appendChild(f));
    node.parentNode.replaceChild(frag, node);
  }
}
</script>

<template>
  <div class="glossary-linker"></div>
</template>

<style>
/* Basic styling for glossary term links */
a.glossary-term {
  text-decoration: underline dotted;
  color: inherit;
  position: relative;
}

/* Hover effect for glossary term links */
a.glossary-term:hover {
  background-color: rgba(var(--vp-c-brand-rgb), 0.05);
}

/* Style for the reference indicator */
a.glossary-term sup {
  color: var(--vp-c-brand);
  font-size: 0.7em;
  font-weight: 500;
  margin-left: 0.1em;
  position: relative;
  top: -0.2em;
}
</style>
