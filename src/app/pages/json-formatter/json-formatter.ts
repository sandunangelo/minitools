import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../core/shared/components/button/button';
import { escapeHtml } from '../../core/shared/escape-html';
import { buildLineSnippet, offsetToLineColumn } from '../../core/shared/line-snippet';

type ViewMode = 'beautify' | 'minify';

interface JsonError {
  message: string;
  /** A "12 | { invalid json ]\n     ^" style snippet pointing at the exact spot — null when
   *  the error message didn't include a character position to locate it from. */
  snippet: string | null;
}

interface ParseResult {
  formatted: string;
  minified: string;
  error: JsonError | null;
}

const SAMPLE = '{\n  "name": "Minitools",\n  "tools": 10,\n  "active": true\n}';

/** [1, 2, ...N] for N lines in `text` — always at least [1], so an empty textarea still shows
 *  a line-1 gutter marker instead of an empty one. */
function lineNumbersFor(text: string): number[] {
  const count = text ? text.split('\n').length : 1;
  return Array.from({ length: count }, (_, i) => i + 1);
}

const JSON_TOKEN_PATTERN =
  /"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}[\]:,]|\s+/g;

type TokenType = 'key' | 'string' | 'number' | 'keyword' | 'punctuation' | 'text';

/** A string token is a "key" rather than a value if the next non-whitespace character after it
 *  (in the original source, not the match itself) is a colon — checked here instead of baking
 *  a lookahead into the pattern, since JS regex alternation doesn't expose which branch of an
 *  alternation fired, making a plain post-match check simpler than threading that through. */
function classify(text: string, restOfSource: string): TokenType {
  if (/^\s+$/.test(text)) {
    return 'text';
  }
  if (text.startsWith('"')) {
    return /^\s*:/.test(restOfSource) ? 'key' : 'string';
  }
  if (text === 'true' || text === 'false' || text === 'null') {
    return 'keyword';
  }
  if (/^-?\d/.test(text)) {
    return 'number';
  }
  return 'punctuation';
}

/**
 * Renders `source` as VS Code–style syntax-highlighted HTML (colors from its default Light+
 * theme, to sit naturally on this app's own light surfaces rather than forcing a dark panel
 * into an otherwise-light page). A small hand-written regex tokenizer rather than a library —
 * JSON's grammar is tiny (strings/numbers/3 keywords/structural punctuation), so a general
 * highlighter would be a lot of unused weight for what's a handful of token types.
 *
 * This only has to look *reasonable* on text that isn't valid JSON yet (the input pane, mid-
 * keystroke) — any run of characters the pattern doesn't recognize (e.g. an unterminated
 * string while it's still being typed) is emitted as plain unstyled text rather than dropped,
 * so nothing ever visually disappears from the backdrop that's still present in the textarea
 * underneath it.
 */
function highlightJson(source: string): string {
  if (!source) {
    return '';
  }
  let html = '';
  let lastIndex = 0;
  JSON_TOKEN_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = JSON_TOKEN_PATTERN.exec(source))) {
    if (match.index > lastIndex) {
      html += escapeHtml(source.slice(lastIndex, match.index));
    }
    const text = match[0];
    const type = classify(text, source.slice(JSON_TOKEN_PATTERN.lastIndex));
    html += type === 'text' ? escapeHtml(text) : `<span class="tok-${type}">${escapeHtml(text)}</span>`;
    lastIndex = JSON_TOKEN_PATTERN.lastIndex;
  }
  if (lastIndex < source.length) {
    html += escapeHtml(source.slice(lastIndex));
  }
  return html;
}

/**
 * V8's JSON.parse errors come in a few differently-shaped messages, only some of which include
 * a character offset directly:
 *  - "Expected X in JSON at position N (line L column C)"
 *  - "Unterminated string in JSON at position N (line L column C)"
 *  - "Unexpected non-whitespace character after JSON at position N (line L column C)"
 *  - "Unexpected token 'x', "<context>" is not valid JSON" — NO position at all, but the
 *    quoted part is a verbatim (optionally "..."-truncated) slice of the original source, so
 *    its offset can still be found by searching for it.
 *  - "Unexpected end of JSON input" — no position, no quoted context either; nothing to locate.
 * Confirmed this is the actual landscape (not assumed) by sampling several invalid inputs
 * directly against this engine's JSON.parse before writing the two extraction strategies below.
 */
function describeJsonError(err: unknown, source: string): JsonError {
  const message = err instanceof Error ? err.message : 'Invalid JSON.';

  const position = /position (\d+)/i.exec(message);
  if (position) {
    return buildErrorSnippet(message, source, Number(position[1]));
  }

  const context = extractQuotedContext(message);
  if (context) {
    const offset = source.indexOf(context);
    if (offset >= 0) {
      return buildErrorSnippet(message, source, offset);
    }
  }

  return { message, snippet: null };
}

/** Pulls the context V8 quotes in an "Unexpected token 'x', "<context>" is not valid JSON"
 *  message — taking the span between the FIRST and LAST `"` (rather than a non-greedy regex)
 *  because the context itself is raw JSON source text and may contain its own quote characters
 *  (e.g. a property name), which a naive `/"(.*)"/` would stop at too early. */
function extractQuotedContext(message: string): string | null {
  const suffix = ' is not valid JSON';
  if (!message.endsWith(suffix)) {
    return null;
  }
  const withoutSuffix = message.slice(0, -suffix.length);
  const firstQuote = withoutSuffix.indexOf('"');
  const lastQuote = withoutSuffix.lastIndexOf('"');
  if (firstQuote === -1 || lastQuote === -1 || firstQuote === lastQuote) {
    return null;
  }
  const context = withoutSuffix.slice(firstQuote + 1, lastQuote);
  return context.startsWith('...') ? context.slice(3) : context;
}

/** Line/column are 1-indexed, same convention V8 itself uses when it does include them. */
function buildErrorSnippet(message: string, source: string, offset: number): JsonError {
  const { line, column } = offsetToLineColumn(source, offset);
  return { message, snippet: buildLineSnippet(source, line, column) };
}

@Component({
  imports: [Button, FormsModule],
  selector: 'sap-json-formatter',
  styleUrl: './json-formatter.scss',
  templateUrl: './json-formatter.html',
})
export class JsonFormatter {
  readonly input = signal('');
  readonly copied = signal(false);
  readonly viewMode = signal<ViewMode>('beautify');

  readonly result = computed<ParseResult | null>(() => {
    const raw = this.input().trim();
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      return { formatted: JSON.stringify(parsed, null, 2), minified: JSON.stringify(parsed), error: null };
    } catch (err) {
      return { formatted: '', minified: '', error: describeJsonError(err, raw) };
    }
  });

  readonly output = computed(() => {
    const result = this.result();
    if (!result || result.error) {
      return '';
    }
    return this.viewMode() === 'beautify' ? result.formatted : result.minified;
  });

  readonly inputLineNumbers = computed(() => lineNumbersFor(this.input()));
  readonly outputLineNumbers = computed(() => lineNumbersFor(this.output()));

  readonly inputHighlightHtml = computed(() => highlightJson(this.input()));
  readonly outputHighlightHtml = computed(() => highlightJson(this.output()));

  readonly canFormatInput = computed(() => {
    const result = this.result();
    return !!result && !result.error;
  });

  /** Neither the line-number gutter nor the syntax-highlight backdrop are the element the user
   *  actually scrolls (that's the — functionally real, but visually invisible-text — textarea
   *  on top), so both have to be kept in lockstep with its scroll position manually; there's no
   *  CSS-only way to link independently-scrollable elements, so this runs on every scroll event.
   *  The backdrop additionally needs scrollLeft synced (long lines scroll horizontally too,
   *  since wrapping is disabled), which the gutter never does — it has no horizontal content. */
  syncScroll(event: Event, gutter: HTMLElement, backdrop: HTMLElement): void {
    const source = event.target as HTMLElement;
    gutter.scrollTop = source.scrollTop;
    backdrop.scrollTop = source.scrollTop;
    backdrop.scrollLeft = source.scrollLeft;
  }

  loadSample(): void {
    this.input.set(SAMPLE);
  }

  clear(): void {
    this.input.set('');
    this.copied.set(false);
  }

  /** Reformats the input pane's OWN text in place (not just the read-only output view) — e.g.
   *  pasting minified JSON and wanting to clean it up right there before copying/continuing to
   *  edit it, rather than only ever seeing a formatted copy on the other side. */
  beautifyInput(): void {
    const result = this.result();
    if (!result || result.error) {
      return;
    }
    this.input.set(result.formatted);
  }

  minifyInput(): void {
    const result = this.result();
    if (!result || result.error) {
      return;
    }
    this.input.set(result.minified);
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
    this.copied.set(false);
  }

  async copyOutput(): Promise<void> {
    const output = this.output();
    if (!output) {
      return;
    }
    await navigator.clipboard.writeText(output);
    this.copied.set(true);
  }
}
