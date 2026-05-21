/**
 * markdown-it plugin that links glossary terms to their anchors at build time.
 * Works on the token stream, so code, headings and existing links are skipped.
 * Usage: md.use(glossaryLinkPlugin, { terms: [{ term, url }, ...] })
 */
export function glossaryLinkPlugin(md, opts = {}) {
  // Longest first so multi-word terms win over their substrings.
  const terms = [...(opts.terms || [])].sort((a, b) => b.term.length - a.term.length);
  if (terms.length === 0) return;

  const compiled = terms.map(({ term, url }) => ({
    url,
    regex: new RegExp(`\\b${md.utils.escapeRE(term)}\\b`, 'gi'),
  }));

  function chooseMatches(content) {
    const matches = [];
    for (const { url, regex } of compiled) {
      for (const m of content.matchAll(regex)) {
        matches.push({ start: m.index, end: m.index + m[0].length, url });
      }
    }
    // Sorted so the earlier (and, on a tie, longer) match wins on overlap.
    matches.sort((a, b) => a.start - b.start || b.end - a.end);

    const chosen = [];
    let cursor = 0;
    for (const m of matches) {
      if (m.start < cursor) continue;
      chosen.push(m);
      cursor = m.end;
    }
    return chosen;
  }

  function buildTokens(content, chosen, state) {
    const tokens = [];
    let last = 0;
    for (const m of chosen) {
      if (m.start > last) {
        const text = new state.Token('text', '', 0);
        text.content = content.slice(last, m.start);
        tokens.push(text);
      }
      // url is trusted (from terms.ts); escape only the visible label.
      const anchor = new state.Token('html_inline', '', 0);
      anchor.content =
        `<a href="${m.url}" class="glossary-term">` +
        md.utils.escapeHtml(content.slice(m.start, m.end)) +
        '</a>';
      tokens.push(anchor);
      last = m.end;
    }
    if (last < content.length) {
      const text = new state.Token('text', '', 0);
      text.content = content.slice(last);
      tokens.push(text);
    }
    return tokens;
  }

  md.core.ruler.push('glossary_link', state => {
    const rel = state.env && state.env.relativePath;
    if (rel && /(^|\/)glossary\.md$/.test(rel)) return; // skip the glossary page itself

    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i];
      if (tok.type !== 'inline' || !tok.children) continue;

      // A heading's inline content follows its heading_open token.
      const prev = tokens[i - 1];
      if (prev && prev.type === 'heading_open') continue;

      const out = [];
      let linkDepth = 0;
      for (const child of tok.children) {
        if (child.type === 'link_open') {
          linkDepth++;
          out.push(child);
        } else if (child.type === 'link_close') {
          linkDepth--;
          out.push(child);
        } else if (linkDepth > 0 || child.type !== 'text') {
          out.push(child);
        } else {
          const chosen = chooseMatches(child.content);
          if (chosen.length === 0) out.push(child);
          else out.push(...buildTokens(child.content, chosen, state));
        }
      }
      tok.children = out;
    }
  });
}
