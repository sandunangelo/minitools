// Shared between XML Formatter and the Loading Indicator Generator (which highlights its
// generated HTML output — structurally just tags/attributes, same tokenizing needs as XML).
import { escapeHtml } from './escape-html';

// Matches one whole markup construct at a time — a comment, a CDATA section, a processing
// instruction, a DOCTYPE, a closing tag, or an opening/self-closing tag — so the highlighter
// can hand each off to its own renderer rather than re-detecting what kind of construct it is
// from inside one giant alternation.
const XML_BLOCK_PATTERN =
  /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<!DOCTYPE[^>]*>|<\/[^>]+>|<[^>]+>/gi;

/**
 * Renders `source` as syntax-highlighted HTML using a classic XML color scheme (tag names and
 * angle brackets in maroon, attribute names in red, attribute values in blue, comments in
 * green) — a hand-written tokenizer rather than a library, same rationale as JSON Formatter's
 * highlightJson(): XML's handful of construct types don't need general-purpose tooling.
 *
 * Like highlightJson(), this only has to look *reasonable* on text that isn't valid XML yet —
 * anything between recognized tags/constructs is rendered as plain text, so a document that's
 * still mid-edit (an unclosed tag, a stray '<') never has characters silently vanish from the
 * backdrop that are still present in the real textarea underneath it.
 */
export function highlightXml(source: string): string {
  if (!source) {
    return '';
  }
  let html = '';
  let lastIndex = 0;
  XML_BLOCK_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = XML_BLOCK_PATTERN.exec(source))) {
    if (match.index > lastIndex) {
      html += `<span class="xml-text">${escapeHtml(source.slice(lastIndex, match.index))}</span>`;
    }
    html += highlightXmlBlock(match[0]);
    lastIndex = XML_BLOCK_PATTERN.lastIndex;
  }
  if (lastIndex < source.length) {
    html += `<span class="xml-text">${escapeHtml(source.slice(lastIndex))}</span>`;
  }
  return html;
}

function highlightXmlBlock(block: string): string {
  if (block.startsWith('<!--')) {
    return `<span class="xml-comment">${escapeHtml(block)}</span>`;
  }
  if (block.startsWith('<![CDATA[')) {
    return `<span class="xml-cdata">${escapeHtml(block)}</span>`;
  }
  if (block.startsWith('<?') || /^<!DOCTYPE/i.test(block)) {
    return `<span class="xml-decl">${escapeHtml(block)}</span>`;
  }
  return highlightXmlTag(block);
}

// Splits a tag into its punctuation (<, </, >, />), its name, and any attribute="value" pairs,
// coloring each separately. The attribute scan starts after the tag name, so a value containing
// something that looks like "x=" is never misread as a second attribute.
function highlightXmlTag(tag: string): string {
  const closing = tag.startsWith('</');
  const selfClosing = tag.endsWith('/>');
  const openLen = closing ? 2 : 1;
  const closeLen = selfClosing ? 2 : 1;
  const inner = tag.slice(openLen, tag.length - closeLen);

  let html = `<span class="xml-punct">${closing ? '&lt;/' : '&lt;'}</span>`;

  const nameMatch = /^[a-zA-Z_][\w:.-]*/.exec(inner);
  let cursor = 0;
  if (nameMatch) {
    html += `<span class="xml-tagname">${escapeHtml(nameMatch[0])}</span>`;
    cursor = nameMatch[0].length;
  }

  const attrPattern = /([a-zA-Z_][\w:.-]*)(\s*=\s*)("[^"]*"|'[^']*')/g;
  attrPattern.lastIndex = cursor;
  let attrMatch: RegExpExecArray | null;
  let lastEnd = cursor;
  while ((attrMatch = attrPattern.exec(inner))) {
    html += escapeHtml(inner.slice(lastEnd, attrMatch.index));
    html += `<span class="xml-attrname">${escapeHtml(attrMatch[1])}</span>`;
    html += escapeHtml(attrMatch[2]);
    html += `<span class="xml-attrvalue">${escapeHtml(attrMatch[3])}</span>`;
    lastEnd = attrPattern.lastIndex;
  }
  html += escapeHtml(inner.slice(lastEnd));

  html += `<span class="xml-punct">${selfClosing ? '/&gt;' : '&gt;'}</span>`;
  return html;
}
