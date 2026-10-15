import { Component, OnDestroy, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../core/shared/components/button/button';
import { highlightXml } from '../../core/shared/highlight-xml';
import { buildLineSnippet } from '../../core/shared/line-snippet';

type ViewMode = 'beautify' | 'minify';

interface XmlError {
  message: string;
  /** A "12 | <bad was="unclosed\n     ^" style snippet pointing at the exact spot — null when
   *  DOMParser's error text didn't match the expected "line L at column C" shape. */
  snippet: string | null;
}

interface ParseResult {
  formatted: string;
  minified: string;
  error: XmlError | null;
}

const SAMPLE =
  '<?xml version="1.0" encoding="UTF-8"?>\n<catalog>\n  <book id="1">\n    <title>Minitools Guide</title>\n    <price>19.99</price>\n  </book>\n</catalog>';

/** [1, 2, ...N] for N lines in `text` — always at least [1], so an empty textarea still shows
 *  a line-1 gutter marker instead of an empty one. */
function lineNumbersFor(text: string): number[] {
  const count = text ? text.split('\n').length : 1;
  return Array.from({ length: count }, (_, i) => i + 1);
}

// highlightXml() itself now lives in core/shared/highlight-xml.ts — the Loading Indicator
// Generator needed the exact same XML-shaped tokenizer for its generated HTML output, so this
// moved there once a second consumer existed (same extraction rule already followed for
// line-snippet.ts/escape-html.ts).

// Chrome's DOMParser reports a malformed document by returning a tree whose root is a single
// <parsererror> element instead of throwing — confirmed empirically against several malformed
// cases plus a valid-XML control: its .textContent always concatenates (with no separator
// between what were originally separate <h3>/<div> text nodes) into "This page contains the
// following errors:error on line L at column C: <message>Below is a rendering of the page up
// to the first error.<original markup...>" — hence the lookahead stopping the capture at
// "Below is a rendering" rather than at end-of-string, which would otherwise swallow the
// trailing rendered markup into the error message.
const PARSER_ERROR_PATTERN = /error on line (\d+) at column (\d+):\s*([\s\S]+?)(?=Below is a rendering|$)/i;

function parseXml(source: string): { doc: Document; error: XmlError | null } {
  const doc = new DOMParser().parseFromString(source, 'application/xml');
  const errorEl = doc.querySelector('parsererror');
  if (!errorEl) {
    return { doc, error: null };
  }
  const raw = errorEl.textContent ?? '';
  const match = PARSER_ERROR_PATTERN.exec(raw);
  if (!match) {
    return { doc, error: { message: raw.trim() || 'Invalid XML.', snippet: null } };
  }
  const line = Number(match[1]);
  const column = Number(match[2]);
  return {
    doc,
    error: { message: match[3].trim(), snippet: buildLineSnippet(source, line, column) },
  };
}

function extractXmlDeclaration(source: string): string | null {
  const match = /^\s*<\?xml[^?]*\?>/i.exec(source);
  return match ? match[0] : null;
}

function escapeXmlText(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// No native equivalent of JSON.stringify(x, null, 2) exists for XML, so beautify walks the
// parsed DOM by hand. An element collapses onto a single line when its only child is text (e.g.
// <price>19.99</price>) instead of always breaking children onto their own lines — otherwise
// every leaf element would cost 3 lines instead of 1, which reads nothing like how a person
// actually hand-formats XML.
function collectBeautifulLines(node: Node, depth: number, lines: string[]): void {
  const indent = '  '.repeat(depth);
  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as Element;
      const attrs = Array.from(el.attributes)
        .map((a) => ` ${a.name}="${a.value.replace(/"/g, '&quot;')}"`)
        .join('');
      const openTag = `<${el.tagName}${attrs}`;
      const meaningfulChildren = Array.from(el.childNodes).filter(
        (c) => !(c.nodeType === Node.TEXT_NODE && !c.textContent?.trim()),
      );
      if (meaningfulChildren.length === 0) {
        lines.push(`${indent}${openTag} />`);
      } else if (meaningfulChildren.length === 1 && meaningfulChildren[0].nodeType === Node.TEXT_NODE) {
        const text = meaningfulChildren[0].textContent?.trim() ?? '';
        lines.push(`${indent}${openTag}>${escapeXmlText(text)}</${el.tagName}>`);
      } else {
        lines.push(`${indent}${openTag}>`);
        collectBeautifulLines(el, depth + 1, lines);
        lines.push(`${indent}</${el.tagName}>`);
      }
    } else if (child.nodeType === Node.COMMENT_NODE) {
      lines.push(`${indent}<!--${child.textContent}-->`);
    } else if (child.nodeType === Node.CDATA_SECTION_NODE) {
      lines.push(`${indent}<![CDATA[${child.textContent}]]>`);
    } else if (child.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
      const pi = child as ProcessingInstruction;
      lines.push(`${indent}<?${pi.target} ${pi.data}?>`);
    } else if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent?.trim();
      if (text) {
        lines.push(`${indent}${escapeXmlText(text)}`);
      }
    }
  }
}

function beautifyXml(doc: Document, declaration: string | null): string {
  const lines: string[] = [];
  if (declaration) {
    lines.push(declaration);
  }
  collectBeautifulLines(doc, 0, lines);
  return lines.join('\n');
}

// Unlike the hand-walked beautify tree (which never sees the declaration, since it isn't
// exposed as a childNode), XMLSerializer reproduces the original declaration verbatim by
// itself whenever the source had one — confirmed empirically — so minify must NOT also
// prepend it, or it ends up duplicated.
function minifyXml(doc: Document): string {
  const serialized = new XMLSerializer().serializeToString(doc);
  return serialized.replace(/>\s+</g, '><').trim();
}

// ---------------------------------------------------------------------------------------------
// Live-typing intellisense for the input editor only (the output pane is read-only, so none of
// this applies there): auto-close/auto-complete tags and quotes, Enter-key auto-indent, and a
// suggestion dropdown sourced from whatever tag/attribute names and values already appear
// elsewhere in the *current* document. There's no DTD/schema available to validate against, so
// "stuff already used in this document" is the only genuinely predictable source of suggestions.
// ---------------------------------------------------------------------------------------------

/** If `text` ends exactly at a complete, non-self-closing opening tag (name optionally followed
 *  by attributes), returns that tag's name — used both to decide whether '>' should auto-close
 *  and whether Enter should indent one level deeper. */
function openingTagEndingAt(text: string): string | null {
  const match = /<([a-zA-Z_][\w:.-]*)([^<>]*)>$/.exec(text);
  if (!match || /\/\s*$/.test(match[2])) {
    return null;
  }
  return match[1];
}

/** Whether `>` just typed at `caret` should auto-insert a matching closing tag — true only for
 *  a "plain" opening tag (not a comment/CDATA/PI/DOCTYPE/closing/already-self-closing tag) and
 *  only when the caret isn't sitting inside a still-open quoted attribute value (where a literal
 *  '>' is legal XML and must NOT be treated as closing the tag). */
function findTagToAutoClose(text: string, caret: number): string | null {
  const tagStart = text.lastIndexOf('<', caret - 1);
  if (tagStart === -1) {
    return null;
  }
  const tagText = text.slice(tagStart, caret);
  if (tagText.includes('>')) {
    return null;
  }
  if (
    tagText.startsWith('</') ||
    tagText.startsWith('<!--') ||
    tagText.startsWith('<![CDATA[') ||
    tagText.startsWith('<?') ||
    /^<!DOCTYPE/i.test(tagText)
  ) {
    return null;
  }
  const dq = (tagText.match(/"/g) || []).length;
  const sq = (tagText.match(/'/g) || []).length;
  if (dq % 2 === 1 || sq % 2 === 1) {
    return null;
  }
  return openingTagEndingAt(tagText + '>')
    ? /^<([a-zA-Z_][\w:.-]*)/.exec(tagText)![1]
    : null;
}

// Matches one complete opening/self-closing/closing tag at a time (comments/CDATA/PI/DOCTYPE
// are matched too, purely so the scan can skip over them without misreading their contents as
// a tag) — used to walk a simple open/close stack up to the caret.
const SIMPLE_TAG_PATTERN =
  /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<!DOCTYPE[^>]*>|<\/([a-zA-Z_][\w:.-]*)\s*>|<([a-zA-Z_][\w:.-]*)([^<>]*)>/g;

/** Walks every complete tag from the start of the document up to `caret`, tracking a simple
 *  open-tag stack, and returns the name of whichever tag is still unclosed and nearest to the
 *  caret — i.e. the one '</' should complete to. Tolerant of a stray/mismatched closing tag
 *  already in the document (removes whichever stack entry matches it, not necessarily the top)
 *  since this only has to be "reasonable" on a document that's still mid-edit. */
function findNearestUnclosedTag(text: string, caret: number): string | null {
  const stack: string[] = [];
  const scanned = text.slice(0, caret);
  SIMPLE_TAG_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = SIMPLE_TAG_PATTERN.exec(scanned))) {
    const closingName = match[1];
    const openingName = match[2];
    const openingRest = match[3];
    if (closingName) {
      const idx = stack.lastIndexOf(closingName);
      if (idx !== -1) {
        stack.splice(idx, 1);
      }
    } else if (openingName && !/\/\s*$/.test(openingRest)) {
      stack.push(openingName);
    }
  }
  return stack.length > 0 ? stack[stack.length - 1] : null;
}

/** What to splice in when Enter is pressed: continues the current line's indentation by
 *  default, goes one level deeper right after an opening tag, and — when pressed exactly
 *  between a freshly-opened tag and its own matching close, e.g. "<book>|</book>" — expands
 *  into a properly nested, indented empty line between the two, same as a real code editor. */
function computeEnterIndent(text: string, caret: number): { insert: string; caretOffset: number } {
  const lineStart = text.lastIndexOf('\n', caret - 1) + 1;
  const currentIndent = /^[ \t]*/.exec(text.slice(lineStart, caret))![0];
  const beforeCaret = text.slice(0, caret);
  const afterCaret = text.slice(caret);

  const closingAhead = /^<\/([a-zA-Z_][\w:.-]*)\s*>/.exec(afterCaret);
  const openBehind = openingTagEndingAt(beforeCaret);

  if (closingAhead && openBehind === closingAhead[1]) {
    const inner = currentIndent + '  ';
    return { insert: `\n${inner}\n${currentIndent}`, caretOffset: 1 + inner.length };
  }
  if (openBehind) {
    const insert = `\n${currentIndent}  `;
    return { insert, caretOffset: insert.length };
  }
  const insert = `\n${currentIndent}`;
  return { insert, caretOffset: insert.length };
}

interface Vocabulary {
  tags: string[];
  attrsByTag: Map<string, string[]>;
  valuesByTagAttr: Map<string, string[]>;
}

/** Scans the raw (possibly still-invalid) input text for every tag/attribute name and attribute
 *  value used anywhere in it — the only genuinely predictable source of autocomplete candidates
 *  here, since there's no DTD/schema to validate or suggest against. Re-run from scratch on
 *  every keystroke rather than incrementally maintained; trivial cost for documents this tool is
 *  actually used on, same no-debouncing precedent as the existing highlight/validate computeds. */
function buildVocabulary(text: string): Vocabulary {
  const tagSet = new Set<string>();
  const attrsByTag = new Map<string, Set<string>>();
  const valuesByTagAttr = new Map<string, Set<string>>();

  const tagPattern = /<([a-zA-Z_][\w:.-]*)([^<>]*)>/g;
  let match: RegExpExecArray | null;
  while ((match = tagPattern.exec(text))) {
    const tagName = match[1];
    tagSet.add(tagName);
    const attrPattern = /([a-zA-Z_][\w:.-]*)\s*=\s*(["'])([^"']*)\2/g;
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = attrPattern.exec(match[2]))) {
      const [, attrName, , attrValue] = attrMatch;
      if (!attrsByTag.has(tagName)) {
        attrsByTag.set(tagName, new Set());
      }
      attrsByTag.get(tagName)!.add(attrName);
      if (attrValue) {
        const key = `${tagName}::${attrName}`;
        if (!valuesByTagAttr.has(key)) {
          valuesByTagAttr.set(key, new Set());
        }
        valuesByTagAttr.get(key)!.add(attrValue);
      }
    }
  }

  const closingPattern = /<\/([a-zA-Z_][\w:.-]*)\s*>/g;
  while ((match = closingPattern.exec(text))) {
    tagSet.add(match[1]);
  }

  return {
    tags: Array.from(tagSet).sort(),
    attrsByTag: new Map(Array.from(attrsByTag, ([k, v]) => [k, Array.from(v).sort()])),
    valuesByTagAttr: new Map(Array.from(valuesByTagAttr, ([k, v]) => [k, Array.from(v).sort()])),
  };
}

interface SuggestionContext {
  kind: 'tag' | 'attr-name' | 'attr-value';
  replaceStart: number;
  replaceEnd: number;
  prefix: string;
  tagName?: string;
  attrName?: string;
}

/** Figures out what kind of thing the caret is in the middle of typing — a tag name, an
 *  attribute name, or an attribute value — and what's already been typed of it, so candidates
 *  can be filtered by that prefix and the right span can be replaced on accept. Returns null for
 *  every other position (plain text content, inside a comment/CDATA/PI/DOCTYPE, mid-typing a
 *  self-close, or right after '</' — that last one is handled instantly by the '/' keystroke
 *  handler instead of a dropdown, since there's exactly one correct completion there). */
function detectSuggestionContext(text: string, caret: number): SuggestionContext | null {
  const tagStart = text.lastIndexOf('<', caret - 1);
  if (tagStart === -1) {
    return null;
  }
  const tagText = text.slice(tagStart, caret);
  if (tagText.includes('>')) {
    return null;
  }
  if (
    tagText.startsWith('</') ||
    tagText.startsWith('<!--') ||
    tagText.startsWith('<![CDATA[') ||
    tagText.startsWith('<?') ||
    /^<!DOCTYPE/i.test(tagText)
  ) {
    return null;
  }

  const bareNameMatch = /^<([a-zA-Z_][\w:.-]*)?$/.exec(tagText);
  if (bareNameMatch) {
    return { kind: 'tag', replaceStart: tagStart + 1, replaceEnd: caret, prefix: bareNameMatch[1] ?? '' };
  }

  const fullNameMatch = /^<([a-zA-Z_][\w:.-]*)/.exec(tagText);
  if (!fullNameMatch) {
    return null;
  }
  const tagName = fullNameMatch[1];
  const afterName = tagText.slice(fullNameMatch[0].length);
  if (afterName.startsWith('/')) {
    return null;
  }

  const dq = (afterName.match(/"/g) || []).length;
  const sq = (afterName.match(/'/g) || []).length;
  if (dq % 2 === 1 || sq % 2 === 1) {
    const quoteChar = dq % 2 === 1 ? '"' : "'";
    const valuePattern = new RegExp(`([a-zA-Z_][\\w:.-]*)\\s*=\\s*${quoteChar}([^${quoteChar}]*)$`);
    const valueMatch = valuePattern.exec(afterName);
    if (!valueMatch) {
      return null;
    }
    return {
      kind: 'attr-value',
      replaceStart: caret - valueMatch[2].length,
      replaceEnd: caret,
      prefix: valueMatch[2],
      tagName,
      attrName: valueMatch[1],
    };
  }

  const wordMatch = /(?:\s|^)([a-zA-Z_][\w:.-]*)$/.exec(afterName);
  if (wordMatch) {
    return { kind: 'attr-name', replaceStart: caret - wordMatch[1].length, replaceEnd: caret, prefix: wordMatch[1], tagName };
  }
  if (afterName === '' || /\s$/.test(afterName)) {
    return { kind: 'attr-name', replaceStart: caret, replaceEnd: caret, prefix: '', tagName };
  }
  return null;
}

function candidatesFor(ctx: SuggestionContext, vocabulary: Vocabulary): string[] {
  let pool: string[];
  if (ctx.kind === 'tag') {
    pool = vocabulary.tags;
  } else if (ctx.kind === 'attr-name') {
    pool = vocabulary.attrsByTag.get(ctx.tagName!) ?? [];
  } else {
    pool = vocabulary.valuesByTagAttr.get(`${ctx.tagName}::${ctx.attrName}`) ?? [];
  }
  const prefixLower = ctx.prefix.toLowerCase();
  return pool.filter((item) => item !== ctx.prefix && item.toLowerCase().startsWith(prefixLower)).slice(0, 8);
}

@Component({
  imports: [Button, FormsModule],
  selector: 'sap-xml-formatter',
  styleUrl: './xml-formatter.scss',
  templateUrl: './xml-formatter.html',
})
export class XmlFormatter implements OnDestroy {
  readonly input = signal('');
  readonly copied = signal(false);
  readonly viewMode = signal<ViewMode>('beautify');

  readonly suggestionItems = signal<string[]>([]);
  readonly suggestionIndex = signal(0);
  readonly suggestionPos = signal<{ top: number; left: number } | null>(null);
  private suggestionContext: SuggestionContext | null = null;
  private mirrorDiv: HTMLDivElement | null = null;

  readonly result = computed<ParseResult | null>(() => {
    const raw = this.input().trim();
    if (!raw) {
      return null;
    }
    const { doc, error } = parseXml(raw);
    if (error) {
      return { formatted: '', minified: '', error };
    }
    const declaration = extractXmlDeclaration(raw);
    return { formatted: beautifyXml(doc, declaration), minified: minifyXml(doc), error: null };
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

  readonly inputHighlightHtml = computed(() => highlightXml(this.input()));
  readonly outputHighlightHtml = computed(() => highlightXml(this.output()));

  readonly canFormatInput = computed(() => {
    const result = this.result();
    return !!result && !result.error;
  });

  ngOnDestroy(): void {
    // The hub's @switch destroys this component on every tab-away, so the mirror div (appended
    // straight to document.body, outside Angular's own view tree) would otherwise leak one
    // detached-but-still-in-DOM hidden element per switch-away-and-back cycle.
    this.mirrorDiv?.remove();
  }

  /** Neither the line-number gutter nor the syntax-highlight backdrop are the element the user
   *  actually scrolls (that's the — functionally real, but visually invisible-text — textarea
   *  on top), so both have to be kept in lockstep with its scroll position manually. */
  syncScroll(event: Event, gutter: HTMLElement, backdrop: HTMLElement): void {
    const source = event.target as HTMLElement;
    gutter.scrollTop = source.scrollTop;
    backdrop.scrollTop = source.scrollTop;
    backdrop.scrollLeft = source.scrollLeft;
    this.closeSuggestions();
  }

  loadSample(): void {
    this.input.set(SAMPLE);
    this.closeSuggestions();
  }

  clear(): void {
    this.input.set('');
    this.copied.set(false);
    this.closeSuggestions();
  }

  /** Reformats the input pane's OWN text in place (not just the read-only output view) — e.g.
   *  pasting minified XML and wanting to clean it up right there before copying/continuing to
   *  edit it, rather than only ever seeing a formatted copy on the other side. */
  beautifyInput(): void {
    const result = this.result();
    if (!result || result.error) {
      return;
    }
    this.input.set(result.formatted);
    this.closeSuggestions();
  }

  minifyInput(): void {
    const result = this.result();
    if (!result || result.error) {
      return;
    }
    this.input.set(result.minified);
    this.closeSuggestions();
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

  /** Handles everything that needs to intercept a keystroke before the browser's own default
   *  action: suggestion-dropdown navigation/accept/dismiss, Enter's auto-indent, tag auto-close,
   *  '</' auto-complete, and quote auto-close/type-over. Anything not handled here (plain
   *  characters, Backspace, arrow-key caret movement, etc.) just falls through to the browser's
   *  native textarea behavior as normal. */
  onInputKeydown(event: KeyboardEvent, el: HTMLTextAreaElement): void {
    if (this.suggestionItems().length > 0) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.moveSuggestion(1);
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.moveSuggestion(-1);
        return;
      }
      if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        this.acceptSuggestion(el);
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        this.closeSuggestions();
        return;
      }
    }

    // Modifier combos (shortcuts, IME composition, etc.) are left entirely to the browser —
    // Shift is excepted since producing '>'/'"' on most layouts requires it.
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    const value = el.value;
    const start = el.selectionStart;
    const end = el.selectionEnd;

    if (event.key === 'Enter') {
      event.preventDefault();
      const { insert, caretOffset } = computeEnterIndent(value, start);
      this.applyEdit(el, value.slice(0, start) + insert + value.slice(end), start + caretOffset);
      this.closeSuggestions();
      return;
    }

    if (start !== end) {
      return;
    }
    const caret = start;

    if (event.key === '>') {
      const tagName = findTagToAutoClose(value, caret);
      if (tagName) {
        event.preventDefault();
        const inserted = `></${tagName}>`;
        this.applyEdit(el, value.slice(0, caret) + inserted + value.slice(caret), caret + 1);
        this.closeSuggestions();
      }
      return;
    }

    if (event.key === '/') {
      if (value.slice(0, caret).endsWith('<')) {
        const openTag = findNearestUnclosedTag(value, caret);
        if (openTag) {
          event.preventDefault();
          // preventDefault() above blocks the native '/' insertion too, so it must be included
          // here explicitly — not just the tag name + '>'.
          const inserted = `/${openTag}>`;
          this.applyEdit(el, value.slice(0, caret) + inserted + value.slice(caret), caret + inserted.length);
          this.closeSuggestions();
        }
      }
      return;
    }

    if (event.key === '"' || event.key === "'") {
      const nextChar = value[caret];
      if (nextChar === event.key) {
        // Type over an already-auto-closed matching quote instead of inserting a duplicate.
        event.preventDefault();
        el.setSelectionRange(caret + 1, caret + 1);
        return;
      }
      const prevChar = value[caret - 1];
      if (prevChar === '=') {
        event.preventDefault();
        this.applyEdit(el, value.slice(0, caret) + event.key + event.key + value.slice(caret), caret + 1);
        this.updateSuggestions(el);
      }
    }
  }

  /** Recomputes (or hides) the suggestion dropdown for the textarea's current caret position —
   *  called after any edit or caret move that isn't already fully handled above. */
  updateSuggestions(el: HTMLTextAreaElement): void {
    if (el.selectionStart !== el.selectionEnd) {
      this.closeSuggestions();
      return;
    }
    const caret = el.selectionStart;
    const ctx = detectSuggestionContext(el.value, caret);
    if (!ctx) {
      this.closeSuggestions();
      return;
    }
    const items = candidatesFor(ctx, buildVocabulary(el.value));
    if (items.length === 0) {
      this.closeSuggestions();
      return;
    }
    this.suggestionContext = ctx;
    this.suggestionItems.set(items);
    this.suggestionIndex.set(0);
    this.suggestionPos.set(this.measureCaretPosition(el, caret, items.length));
  }

  /** (keyup) companion to onInputKeydown — only recomputes for keys that weren't ALREADY fully
   *  handled there (Enter/Tab/Escape always were; Up/Down were too, but only while a dropdown
   *  was already open — recomputing for those here would immediately reset moveSuggestion's
   *  freshly-changed index back to 0). Everything else (Left/Right/Home/End/plain typing/etc.)
   *  falls through to a normal recompute at the new caret position. */
  onInputKeyup(event: KeyboardEvent, el: HTMLTextAreaElement): void {
    if (event.key === 'Enter' || event.key === 'Tab' || event.key === 'Escape') {
      return;
    }
    if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && this.suggestionItems().length > 0) {
      return;
    }
    this.updateSuggestions(el);
  }

  closeSuggestions(): void {
    this.suggestionItems.set([]);
    this.suggestionContext = null;
    this.suggestionPos.set(null);
  }

  private moveSuggestion(delta: number): void {
    const count = this.suggestionItems().length;
    if (count === 0) {
      return;
    }
    this.suggestionIndex.set((this.suggestionIndex() + delta + count) % count);
  }

  onSuggestionMouseDown(event: MouseEvent, index: number, el: HTMLTextAreaElement): void {
    event.preventDefault(); // keep focus/selection in the textarea instead of blurring it
    this.suggestionIndex.set(index);
    this.acceptSuggestion(el);
  }

  private acceptSuggestion(el: HTMLTextAreaElement): void {
    const ctx = this.suggestionContext;
    const items = this.suggestionItems();
    if (!ctx || items.length === 0) {
      return;
    }
    const chosen = items[this.suggestionIndex()];
    const value = el.value;
    let insertText = chosen;
    let caretOffset = chosen.length;
    if (ctx.kind === 'attr-name') {
      insertText = `${chosen}=""`;
      caretOffset = chosen.length + 2; // land between the quotes
    }
    const newValue = value.slice(0, ctx.replaceStart) + insertText + value.slice(ctx.replaceEnd);
    this.applyEdit(el, newValue, ctx.replaceStart + caretOffset);
    this.closeSuggestions();
    this.updateSuggestions(el); // e.g. finishing an attribute name naturally chains into its value suggestions
  }

  /** Commits a programmatic edit the way a real keystroke would: mutate the DOM element
   *  directly (so the caret can be placed exactly, synchronously, in the same tick) and then
   *  sync the signal so every derived computed (highlighting, line numbers, validation) picks
   *  it up. Writing the same string back via the signal afterward is a no-op for the DOM, so it
   *  doesn't disturb the caret position just set. */
  private applyEdit(el: HTMLTextAreaElement, newValue: string, newCaret: number): void {
    el.value = newValue;
    el.setSelectionRange(newCaret, newCaret);
    this.input.set(newValue);
  }

  // The DOM has no built-in way to ask "what pixel position is character N at" inside a
  // <textarea> — the standard workaround is a hidden off-screen <div> styled identically to the
  // textarea, fed the same text up to the caret, with a marker <span> appended right there to
  // read its offsetLeft/offsetTop from.
  private getMirrorDiv(el: HTMLTextAreaElement): HTMLDivElement {
    if (!this.mirrorDiv) {
      this.mirrorDiv = document.createElement('div');
      this.mirrorDiv.style.position = 'absolute';
      this.mirrorDiv.style.visibility = 'hidden';
      this.mirrorDiv.style.top = '0';
      this.mirrorDiv.style.left = '-9999px';
      this.mirrorDiv.style.whiteSpace = 'pre';
      document.body.appendChild(this.mirrorDiv);
    }
    const style = getComputedStyle(el);
    this.mirrorDiv.style.font = style.font;
    this.mirrorDiv.style.letterSpacing = style.letterSpacing;
    this.mirrorDiv.style.padding = style.padding;
    this.mirrorDiv.style.border = style.border;
    this.mirrorDiv.style.boxSizing = style.boxSizing;
    this.mirrorDiv.style.width = `${el.clientWidth}px`;
    return this.mirrorDiv;
  }

  /** Caret pixel position relative to the textarea's own top-left (i.e. already adjusted for
   *  its current scroll position), with a simple flip-upward fallback so the dropdown doesn't
   *  render below the visible viewport when the caret is near the bottom of it. */
  private measureCaretPosition(
    el: HTMLTextAreaElement,
    caret: number,
    itemCount: number,
  ): { top: number; left: number } {
    const mirror = this.getMirrorDiv(el);
    mirror.textContent = el.value.slice(0, caret);
    const marker = document.createElement('span');
    marker.textContent = el.value.slice(caret) || '.';
    mirror.appendChild(marker);
    const caretLeft = marker.offsetLeft - el.scrollLeft;
    const caretTop = marker.offsetTop - el.scrollTop;
    const lineHeight = marker.offsetHeight;
    mirror.removeChild(marker);

    const estimatedListHeight = Math.min(itemCount, 8) * 26 + 8;
    const fitsBelow = caretTop + lineHeight + estimatedListHeight <= el.clientHeight;
    const top = fitsBelow ? caretTop + lineHeight : caretTop - estimatedListHeight;
    return { top: Math.max(0, top), left: caretLeft };
  }
}
