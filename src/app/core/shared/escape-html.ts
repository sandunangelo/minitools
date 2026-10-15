// Shared between JSON Formatter and XML Formatter's syntax highlighters — both build an HTML
// string for [innerHTML] out of arbitrary user-typed text, so every literal chunk needs this
// before it's embedded (both as basic XSS hygiene and so stray `<`/`>`/`&` in the user's own
// JSON/XML content render as literal text instead of being interpreted as markup).
export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
