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

  // Process text nodes
  processTextNodes(contentEl, sortedTerms);
});

function processTextNodes(element, terms) {
  // Skip processing for headers, code blocks, etc.
  if (
    element.tagName === 'CODE' ||
    element.tagName === 'PRE' ||
    element.tagName === 'A' ||
    element.tagName === 'SCRIPT' ||
    element.tagName === 'STYLE' ||
    element.tagName?.match(/^H[1-6]$/)
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

  for (const { term, url } of terms) {
    // Create a case-insensitive regular expression
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');

    let match;
    while ((match = regex.exec(content)) !== null) {
      changed = true;

      // Add text before match
      if (match.index > lastIndex) {
        fragments.push(document.createTextNode(content.substring(lastIndex, match.index)));
      }

      // Create link for match
      const link = document.createElement('a');
      link.href = url;
      link.textContent = match[0];
      link.classList.add('glossary-term');
      fragments.push(link);

      lastIndex = regex.lastIndex;
    }
  }

  // Add remaining text
  if (lastIndex < content.length) {
    fragments.push(document.createTextNode(content.substring(lastIndex)));
  }

  // Replace node if we made changes
  if (changed) {
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
.glossary-term {
  color: var(--vp-c-brand);
  text-decoration: none;
  border-bottom: 1px dashed var(--vp-c-brand);
}
.glossary-term:hover {
  border-bottom: 1px solid var(--vp-c-brand);
}
</style>
