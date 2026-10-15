import { Component, Type, computed, inject, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Tile } from '../core/shared/components/tile/tile';
import { ToolOrderService } from '../core/shared/services/tool-order.service';
import { DashboardWidgetsService } from '../core/shared/services/dashboard-widgets.service';
import { Tool, TOOLS } from '../core/shared/models/tool';

// Small hand-rolled lexicon rather than a library — same reasoning as every other hand-rolled
// mini-parser in this app (JSON/XML tokenizers, HTML entity handling): the vocabulary a casual
// search-box query would ever plausibly contain is tiny compared to a full sentiment-analysis
// package, so a short word list covers the realistic cases without a new runtime dependency.
const POSITIVE_WORDS = new Set([
  'good', 'great', 'awesome', 'amazing', 'excellent', 'nice', 'love', 'loved', 'loving',
  'cool', 'best', 'perfect', 'fantastic', 'wonderful', 'brilliant', 'helpful', 'useful',
  'easy', 'fast', 'happy', 'fun', 'beautiful', 'super', 'favorite', 'favourite', 'thanks',
  'thank', 'please', 'enjoy', 'enjoyed', 'like', 'liked', 'simple', 'smooth', 'clean',
  'clever', 'handy', 'neat', 'wow', 'yay', 'glad', 'impressive', 'delightful',
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'terrible', 'awful', 'horrible', 'hate', 'hated', 'hating', 'worst', 'ugly',
  'broken', 'buggy', 'bug', 'annoying', 'frustrating', 'frustrated', 'slow', 'confusing',
  'confused', 'useless', 'difficult', 'hard', 'fail', 'failed', 'failing', 'error',
  'wrong', 'stupid', 'dumb', 'lame', 'boring', 'ugh', 'angry', 'mad', 'disappointed',
  'disappointing', 'sucks', 'sucked', 'garbage', 'trash', 'crappy', 'annoyed', 'hateful',
]);

// The word immediately before a sentiment word flips its polarity ("not good" → negative). No
// intensifiers, no multi-word phrases — a short search query doesn't need more than this.
const NEGATION_WORDS = new Set(['not', 'no', 'never', 'without', "don't", "doesn't", "isn't", "wasn't"]);

interface Sentiment {
  label: 'Positive' | 'Neutral' | 'Negative';
  emoji: string;
  score: number;
}

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[a-z']+/g) ?? [];
}

function scoreSentiment(text: string): Sentiment {
  const words = tokenize(text);
  let score = 0;
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const negated = i > 0 && NEGATION_WORDS.has(words[i - 1]);
    if (POSITIVE_WORDS.has(word)) {
      score += negated ? -1 : 1;
    } else if (NEGATIVE_WORDS.has(word)) {
      score += negated ? 1 : -1;
    }
  }
  if (score > 0) {
    return { label: 'Positive', emoji: '😊', score };
  }
  if (score < 0) {
    return { label: 'Negative', emoji: '😕', score };
  }
  return { label: 'Neutral', emoji: '😐', score };
}

// One lazy loader per widget-able tool — a plain id → import() map, deliberately mirroring
// app.routes.ts's own per-route dynamic imports (just one directory level up from here) rather
// than importing any tool component eagerly. A tool's code must only ever download once the
// user actually adds it as a widget; importing even one of these at module scope here would
// pull that whole tool's chunk into Dashboard's own lazy chunk permanently, for every visitor,
// whether they ever add a single widget or not — see the "shared component with a heavy
// dependency pulls it out of its lazy chunk" gotcha already in project memory for the general
// shape of this failure mode.
const WIDGET_LOADERS: Record<string, () => Promise<Type<unknown>>> = {
  financial: () => import('../pages/financial/financial').then((m) => m.Financial),
  'world-clock': () => import('../pages/world-clock/world-clock').then((m) => m.WorldClock),
  'unit-converter': () => import('../pages/unit-converter/unit-converter').then((m) => m.UnitConverter),
  'bmi-calculator': () => import('../pages/bmi-calculator/bmi-calculator').then((m) => m.BmiCalculator),
  'password-generator': () =>
    import('../pages/password-generator/password-generator').then((m) => m.PasswordGenerator),
  'color-converter': () => import('../pages/color-converter/color-converter').then((m) => m.ColorConverter),
  'text-case-converter': () =>
    import('../pages/text-case-converter/text-case-converter').then((m) => m.TextCaseConverter),
  'word-counter': () => import('../pages/word-counter/word-counter').then((m) => m.WordCounter),
  'text-converters': () => import('../pages/text-converters/text-converters').then((m) => m.TextConverters),
  'tip-calculator': () => import('../pages/tip-calculator/tip-calculator').then((m) => m.TipCalculator),
  'string-codec': () => import('../pages/string-codec/string-codec').then((m) => m.StringCodec),
  'loading-indicator': () =>
    import('../pages/loading-indicator/loading-indicator').then((m) => m.LoadingIndicator),
};

@Component({
  imports: [RouterLink, Tile, FormsModule, NgComponentOutlet],
  selector: 'sap-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly toolOrder = inject(ToolOrderService);
  readonly widgets = inject(DashboardWidgetsService);

  readonly tools = this.toolOrder.orderedTools;

  private readonly toolsById = computed(() => new Map(TOOLS.map((tool) => [tool.id, tool])));

  toolFor(id: string): Tool | undefined {
    return this.toolsById().get(id);
  }

  readonly searchText = signal('');
  readonly isSearching = computed(() => this.searchText().trim().length > 0);
  readonly searchSentiment = computed(() => scoreSentiment(this.searchText()));

  // Matches if ANY remaining word appears in a tool's title/description, and — since this same
  // box now doubles as a sentiment prompt — first strips out words from our own sentiment
  // lexicon ("awesome", "annoying", "not", ...) before matching. Without that, typing something
  // like "awesome json tool" (a completely reasonable thing to type once the box visibly reacts
  // to tone) would search for that exact multi-word phrase as one literal substring and match
  // nothing, since no real tool description happens to contain a user's casual commentary verbatim.
  readonly filteredTools = computed(() => {
    const words = tokenize(this.searchText()).filter(
      (word) => !POSITIVE_WORDS.has(word) && !NEGATIVE_WORDS.has(word) && !NEGATION_WORDS.has(word),
    );
    if (words.length === 0) {
      return this.tools();
    }
    return this.tools().filter((tool) => {
      const haystack = `${tool.title} ${tool.description}`.toLowerCase();
      return words.some((word) => haystack.includes(word));
    });
  });

  // --- Widget board: the star toggles a tile's widget, the tile itself still just navigates ---

  private readonly loadedComponents = signal<ReadonlyMap<string, Type<unknown>>>(new Map());

  componentFor(id: string): Type<unknown> | undefined {
    return this.loadedComponents().get(id);
  }

  /** The star sits beside the tile's `<a>`, not inside it — stopping propagation here is cheap
   *  insurance (it's a sibling, not nested, so a click on it was never going to bubble into the
   *  tile's own navigation anyway) rather than something strictly required. */
  toggleWidget(event: Event, id: string): void {
    event.preventDefault();
    event.stopPropagation();
    const wasWidget = this.widgets.isWidget(id);
    this.widgets.toggle(id);
    if (!wasWidget) {
      this.ensureLoaded(id);
    }
  }

  private ensureLoaded(id: string): void {
    if (this.loadedComponents().has(id)) {
      return;
    }
    const loader = WIDGET_LOADERS[id];
    if (!loader) {
      return;
    }
    loader().then((component) => {
      this.loadedComponents.update((map) => new Map(map).set(id, component));
    });
  }

  constructor() {
    // Re-load components for whatever widgets were already pinned from a previous session —
    // not just ones added fresh in this one.
    for (const id of this.widgets.ids()) {
      this.ensureLoaded(id);
    }
  }

  // --- Tile catalog's own drag-to-reorder (unrelated to widget order) -------------------------

  readonly dragOverToolId = signal<string | null>(null);
  private dragToolId: string | null = null;

  onDragStart(event: DragEvent, id: string): void {
    this.dragToolId = id;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', id);
    }
  }

  onDragOver(event: DragEvent, id: string): void {
    event.preventDefault();
    if (this.dragToolId && this.dragToolId !== id) {
      this.dragOverToolId.set(id);
    }
  }

  onDrop(event: DragEvent, targetId: string): void {
    event.preventDefault();
    const source = this.dragToolId;
    this.dragOverToolId.set(null);
    if (source) {
      this.toolOrder.reorder(source, targetId);
    }
    this.dragToolId = null;
  }

  onDragEnd(): void {
    this.dragToolId = null;
    this.dragOverToolId.set(null);
  }

  // --- Widget board's own drag-to-reorder ------------------------------------------------------

  readonly widgetDragOverId = signal<string | null>(null);
  private widgetDragId: string | null = null;

  onWidgetDragStart(event: DragEvent, id: string): void {
    this.widgetDragId = id;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', id);
    }
  }

  onWidgetDragOver(event: DragEvent, id: string): void {
    event.preventDefault();
    if (this.widgetDragId && this.widgetDragId !== id) {
      this.widgetDragOverId.set(id);
    }
  }

  onWidgetDrop(event: DragEvent, targetId: string): void {
    event.preventDefault();
    const source = this.widgetDragId;
    this.widgetDragOverId.set(null);
    if (source) {
      this.widgets.reorder(source, targetId);
    }
    this.widgetDragId = null;
  }

  onWidgetDragEnd(): void {
    this.widgetDragId = null;
    this.widgetDragOverId.set(null);
  }
}
