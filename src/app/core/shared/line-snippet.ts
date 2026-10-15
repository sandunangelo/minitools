// Shared between JSON Formatter and XML Formatter (both under the Text Converters hub) — each
// validates with a different native API (JSON.parse vs. DOMParser) that reports an error
// location differently (a raw character offset vs. a ready-made line/column pair), but both
// end up wanting the exact same "12 | { the actual line }\n     ^" style pointer underneath.

/** Converts a raw character offset into a 1-indexed {line, column} pair. */
export function offsetToLineColumn(source: string, offset: number): { line: number; column: number } {
  const before = source.slice(0, offset);
  const linesBefore = before.split('\n');
  return { line: linesBefore.length, column: linesBefore[linesBefore.length - 1].length + 1 };
}

/** "12 | the actual source line\n     ^" — line/column are 1-indexed. */
export function buildLineSnippet(source: string, line: number, column: number): string {
  const lineText = source.split('\n')[line - 1] ?? '';
  const prefix = `${line} | `;
  const caretLine = ' '.repeat(prefix.length + column - 1) + '^';
  return `${prefix}${lineText}\n${caretLine}`;
}
