import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../core/shared/components/button/button';
import { PageHeader } from '../../core/shared/components/page-header/page-header';
import { COLOR_CONVERTER_STORAGE_KEY as STORAGE_KEY } from '../../core/shared/storage-keys';

const MAX_HISTORY = 10;

interface Rgb {
  r: number;
  g: number;
  b: number;
}

interface Hsl {
  h: number;
  s: number;
  l: number;
}

/** Accepts a 3- or 6-digit hex color, with or without a leading "#". */
function hexToRgb(text: string): Rgb | null {
  const trimmed = text.trim();
  const match6 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(trimmed);
  if (match6) {
    return { r: parseInt(match6[1], 16), g: parseInt(match6[2], 16), b: parseInt(match6[3], 16) };
  }
  const match3 = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(trimmed);
  if (match3) {
    return {
      r: parseInt(match3[1] + match3[1], 16),
      g: parseInt(match3[2] + match3[2], 16),
      b: parseInt(match3[3] + match3[3], 16),
    };
  }
  return null;
}

/** Accepts "rgb(255, 102, 0)", "rgb(255 102 0)", or a bare "255, 102, 0" triple. The "rgb("
 *  prefix and its closing ")" are optional as a PAIR — `rgba?\(?` would wrongly make only the
 *  "(" optional while still requiring the literal "rgb" text, rejecting a bare triple outright. */
function rgbTextToRgb(text: string): Rgb | null {
  const match =
    /^(?:rgba?\()?\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*(?:[,/]\s*[\d.]+\s*)?\)?$/i.exec(
      text.trim(),
    );
  if (!match) {
    return null;
  }
  const [r, g, b] = [match[1], match[2], match[3]].map(Number);
  if ([r, g, b].some((n) => n > 255)) {
    return null;
  }
  return { r, g, b };
}

/** Accepts "hsl(210, 100%, 50%)", "hsl(210 100% 50%)", or a bare "210, 100%, 50%" triple. Same
 *  "prefix + paren as one optional unit" fix as `rgbTextToRgb` above. */
function hslTextToHsl(text: string): Hsl | null {
  const match =
    /^(?:hsla?\()?\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})%?\s*[,\s]\s*(\d{1,3})%?\s*(?:[,/]\s*[\d.]+\s*)?\)?$/i.exec(
      text.trim(),
    );
  if (!match) {
    return null;
  }
  const [h, s, l] = [match[1], match[2], match[3]].map(Number);
  if (h > 360 || s > 100 || l > 100) {
    return null;
  }
  return { h, s, l };
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;
  let [r1, g1, b1] = [0, 0, 0];
  if (h < 60) {
    [r1, g1, b1] = [c, x, 0];
  } else if (h < 120) {
    [r1, g1, b1] = [x, c, 0];
  } else if (h < 180) {
    [r1, g1, b1] = [0, c, x];
  } else if (h < 240) {
    [r1, g1, b1] = [0, x, c];
  } else if (h < 300) {
    [r1, g1, b1] = [x, 0, c];
  } else {
    [r1, g1, b1] = [c, 0, x];
  }
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const l = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) {
    return { h: 0, s: 0, l: Math.round(l * 100) };
  }

  const s = delta / (1 - Math.abs(2 * l - 1));
  let h: number;
  switch (max) {
    case rNorm:
      h = ((gNorm - bNorm) / delta) % 6;
      break;
    case gNorm:
      h = (bNorm - rNorm) / delta + 2;
      break;
    default:
      h = (rNorm - gNorm) / delta + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) {
    h += 360;
  }

  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Detects which of the three accepted formats `text` is written in and resolves it to RGB —
 *  the component's one canonical internal representation, same idea as [[project-minitools-app]]'s
 *  other tools always deriving display state from one source of truth. Hex is checked first
 *  (its own `#`/hex-digit shape is unambiguous); a bare 3-number triple with no "hsl"/"%" marker
 *  defaults to RGB rather than HSL, since that's the more common bare-triple shorthand. */
function parseColorInput(text: string): Rgb | null {
  const trimmed = text.trim();
  if (!trimmed) {
    return null;
  }
  const hex = hexToRgb(trimmed);
  if (hex) {
    return hex;
  }
  if (/hsl/i.test(trimmed) || trimmed.includes('%')) {
    const hsl = hslTextToHsl(trimmed);
    return hsl ? hslToRgb(hsl) : null;
  }
  return rgbTextToRgb(trimmed);
}

/** Reads recent conversions (most recent first) back from localStorage. Never throws. */
function loadStoredHistory(): string[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every((entry) => typeof entry === 'string')) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** Persists recent conversions. Storage failures (e.g. private browsing quota) are
 *  non-critical, so they're swallowed rather than surfaced. */
function saveStoredHistory(history: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Ignore - persistence is a nice-to-have, not required for the page to function.
  }
}

@Component({
  imports: [Button, FormsModule, NgTemplateOutlet, PageHeader],
  selector: 'sap-color-converter',
  styleUrl: './color-converter.scss',
  templateUrl: './color-converter.html',
})
export class ColorConverter {
  readonly colorInput = signal('#3366ff');
  readonly copied = signal('');
  readonly history = signal<string[]>(loadStoredHistory() ?? []);

  readonly rgb = computed(() => parseColorInput(this.colorInput()));
  readonly hsl = computed<Hsl | null>(() => {
    const rgb = this.rgb();
    return rgb ? rgbToHsl(rgb) : null;
  });

  readonly hexText = computed(() => {
    const rgb = this.rgb();
    return rgb ? rgbToHex(rgb) : '';
  });

  readonly rgbText = computed(() => {
    const rgb = this.rgb();
    return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '';
  });

  readonly hslText = computed(() => {
    const hsl = this.hsl();
    return hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '';
  });

  constructor() {
    effect(() => {
      saveStoredHistory(this.history());
    });
  }

  async copy(label: string, value: string): Promise<void> {
    await navigator.clipboard.writeText(value);
    this.copied.set(label);
  }

  /** Commits the current color to "recent conversions" — called on deliberate checkpoints
   *  (blur, Enter, picking from the swatch) rather than every keystroke, so typing doesn't
   *  flood the list with half-finished input. Re-visiting an already-saved color bumps it to
   *  the front instead of duplicating it. */
  commitToHistory(): void {
    const hex = this.hexText();
    if (!hex) {
      return;
    }
    this.history.update((list) => [hex, ...list.filter((entry) => entry !== hex)].slice(0, MAX_HISTORY));
  }

  useHistoryEntry(hex: string): void {
    this.colorInput.set(hex);
  }

  removeHistoryEntry(hex: string): void {
    this.history.update((list) => list.filter((entry) => entry !== hex));
  }
}
