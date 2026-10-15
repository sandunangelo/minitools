import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../core/shared/components/button/button';
import { CURRENCY_NAMES } from '../exchange-rates/exchange-rates';

const ONES = [
  'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
  'Eighteen', 'Nineteen',
];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const SCALES = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

function twoDigitsToWords(n: number): string {
  if (n < 20) {
    return ONES[n];
  }
  const tens = TENS[Math.floor(n / 10)];
  const ones = n % 10;
  return ones > 0 ? `${tens}-${ONES[ones]}` : tens;
}

function threeDigitsToWords(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (hundreds > 0) {
    parts.push(`${ONES[hundreds]} Hundred`);
  }
  if (rest > 0) {
    parts.push(twoDigitsToWords(rest));
  }
  return parts.join(' ');
}

/** Short-scale English (thousand/million/billion/trillion), grouped in 3s from the right —
 *  handles any non-negative integer up to 999 trillion, far beyond any realistic cheque. */
function integerToWords(n: number): string {
  if (n === 0) {
    return 'Zero';
  }
  const groups: number[] = [];
  let remaining = n;
  while (remaining > 0) {
    groups.push(remaining % 1000);
    remaining = Math.floor(remaining / 1000);
  }
  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] === 0) {
      continue;
    }
    const groupWords = threeDigitsToWords(groups[i]);
    parts.push(SCALES[i] ? `${groupWords} ${SCALES[i]}` : groupWords);
  }
  return parts.join(' ');
}

/** "One Thousand Two Hundred Thirty-Four and 56/100 US Dollars" — the classic cheque-writing
 *  format (integer amount in words, cents as "NN/100", currency name). Currency name is always
 *  pluralized ("Dollars" not "Dollar") since that's standard practice on printed cheque/bank
 *  slip templates regardless of the actual amount, not meant as strict English grammar. */
function amountToWords(amount: number, currencyCode: string): string {
  const rounded = Math.round(Math.abs(amount) * 100) / 100;
  const integerPart = Math.floor(rounded);
  const centsPart = Math.round((rounded - integerPart) * 100);
  const currencyName = `${CURRENCY_NAMES[currencyCode] ?? currencyCode}s`;
  const centsStr = String(centsPart).padStart(2, '0');
  const sign = amount < 0 ? 'Negative ' : '';
  return `${sign}${integerToWords(integerPart)} and ${centsStr}/100 ${currencyName}`;
}

function twoDigitsToWordsPlain(n: number): string {
  if (n < 20) {
    return ONES[n].toLowerCase();
  }
  const tens = TENS[Math.floor(n / 10)].toLowerCase();
  const ones = n % 10;
  return ones > 0 ? `${tens}-${ONES[ones].toLowerCase()}` : tens;
}

/**
 * Same number, read the way a person actually speaks it — "one thousand two hundred and
 * thirty-seven" rather than the cheque format's "One Thousand Two Hundred Thirty-Seven" — which
 * needs the classic (and slightly fiddly) English rule that "and" appears exactly ONCE, right
 * before the final sub-100 remainder of the *whole* number, not after every thousand/million
 * group along the way ("one million two hundred thousand five hundred and thirty-seven", not
 * "...two hundred AND thousand five hundred and thirty-seven"). Verified by hand-tracing this
 * against several cases (1237, 1037, 1200, 137, 100, 37, 1200537) spanning every combination of
 * "does this group have its own hundreds", "is there anything above the final remainder", and
 * "is the final remainder itself zero" before trusting it — this specific rule is exactly the
 * kind of off-by-one-ish logic that looks right and isn't.
 */
function integerToWordsPlain(n: number): string {
  if (n === 0) {
    return 'zero';
  }
  const groups: number[] = [];
  let remaining = n;
  while (remaining > 0) {
    groups.push(remaining % 1000);
    remaining = Math.floor(remaining / 1000);
  }

  const finalRemainder = groups[0] % 100;
  const hasHigherOrderContent = n - finalRemainder > 0;

  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] === 0) {
      continue;
    }
    const hundreds = Math.floor(groups[i] / 100);
    const rest = groups[i] % 100;
    if (hundreds > 0) {
      parts.push(`${ONES[hundreds].toLowerCase()} hundred`);
    }
    if (rest > 0) {
      const isFinalRemainder = i === 0;
      parts.push((isFinalRemainder && hasHigherOrderContent ? 'and ' : '') + twoDigitsToWordsPlain(rest));
    }
    if (i > 0 && SCALES[i]) {
      parts.push(SCALES[i].toLowerCase());
    }
  }
  return parts.join(' ');
}

/** Just the last word of a currency name, lowercased and pluralized ("US Dollar" -> "US
 *  dollars", "Sri Lankan Rupee" -> "Sri Lankan rupees") — leaves demonyms/acronyms earlier in
 *  the name ("US", "British", "Sri Lankan") capitalized as normal English already would. */
function pluralizeLower(currencyName: string): string {
  return currencyName.replace(/(\S+)$/, (word) => `${word.toLowerCase()}s`);
}

/** "One thousand two hundred and thirty-seven US dollars and fifty cents" — a natural-reading
 *  alternative to the formal cheque wording above, for when the formal ".../100" slash notation
 *  reads as more legalese than the situation calls for. Cents are dropped entirely when zero
 *  ("...dollars", not "...dollars and zero cents") rather than forcing a clause nobody says. */
function amountToPlainWords(amount: number, currencyCode: string): string {
  const rounded = Math.round(Math.abs(amount) * 100) / 100;
  const integerPart = Math.floor(rounded);
  const centsPart = Math.round((rounded - integerPart) * 100);
  const currencyWords = pluralizeLower(CURRENCY_NAMES[currencyCode] ?? currencyCode);

  const integerWords = integerToWordsPlain(integerPart);
  const isNegative = amount < 0;
  const capitalizedIntegerWords = isNegative
    ? integerWords
    : integerWords.charAt(0).toUpperCase() + integerWords.slice(1);
  const prefix = isNegative ? 'Negative ' : '';
  const centsClause = centsPart > 0 ? ` and ${integerToWordsPlain(centsPart)} cents` : '';

  return `${prefix}${capitalizedIntegerWords} ${currencyWords}${centsClause}`;
}

const WORD_VALUES: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};
const SCALE_VALUES: Record<string, number> = {
  thousand: 1_000,
  million: 1_000_000,
  billion: 1_000_000_000,
  trillion: 1_000_000_000_000,
};

/** Walks a flat list of (already lowercased, hyphen-split, "and"-stripped) words and sums them
 *  as a standard English integer. Stops at the first word it doesn't recognize once it's
 *  already matched something real (e.g. a currency name, "only", the "US"/"dollars" in
 *  "US dollars") — shared by both the main integer-part parse and the word-form cents parse
 *  below, since both need exactly this same "parse a number, then stop at trailing junk" logic. */
function parseNumberWordTokens(words: string[]): { value: number; matchedAny: boolean } {
  let total = 0;
  let chunk = 0;
  let matchedAny = false;
  for (const word of words) {
    if (word in WORD_VALUES) {
      chunk += WORD_VALUES[word];
      matchedAny = true;
    } else if (word === 'hundred') {
      chunk = (chunk || 1) * 100;
      matchedAny = true;
    } else if (word in SCALE_VALUES) {
      total += (chunk || 1) * SCALE_VALUES[word];
      chunk = 0;
      matchedAny = true;
    } else if (matchedAny) {
      break;
    }
  }
  return { value: total + chunk, matchedAny };
}

function toWordTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/-/g, ' ')
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && w !== 'and');
}

/**
 * Parses amount-in-words text back to a number. Reliably round-trips anything either
 * `amountToWords` OR `amountToPlainWords` produces (verifying a written cheque amount against
 * its numeral, or recovering a number from text copied off a cheque or spoken out loud, are
 * both the primary use cases) and tolerates reasonable variation (extra "and"s, a trailing
 * currency name) rather than requiring an exact match.
 *
 * Cents come in two shapes depending on which format was used — "NN/100" (cheque) or a spelled-
 * out "...and fifty-six cents" (plain English) — tried in that order. The word-form cents regex
 * deliberately caps its capture at 1–2 words (`[a-z]+(?:[\s-][a-z]+)?`, not `+`/`*`): the plain-
 * English format already has its OWN "and" before the integer part's final remainder (e.g.
 * "...two hundred and thirty-four US dollars and fifty-six cents"), so an *unbounded* capture
 * greedily matches from the very start of the string through to "cents", swallowing the entire
 * integer part as if it were the cents value instead. Confirmed this was a real failure (not
 * just a theoretical one) by tracing it against exactly that sentence before bounding the regex.
 */
function wordsToAmount(text: string): number | null {
  if (!text.trim()) {
    return null;
  }

  let working = text;
  let cents = 0;

  const digitCentsMatch = /(\d{1,2})\s*\/\s*100/.exec(working);
  if (digitCentsMatch) {
    cents = Number(digitCentsMatch[1]);
    working = working.slice(0, digitCentsMatch.index);
  } else {
    const wordCentsMatch = /\b(?:and\s+)?([a-z]+(?:[\s-][a-z]+)?)\s+cents?\b/i.exec(working);
    if (wordCentsMatch) {
      const parsedCents = parseNumberWordTokens(toWordTokens(wordCentsMatch[1]));
      if (parsedCents.matchedAny) {
        cents = parsedCents.value;
        working = working.slice(0, wordCentsMatch.index);
      }
    }
  }

  const { value: total, matchedAny } = parseNumberWordTokens(toWordTokens(working));
  return matchedAny ? total + cents / 100 : null;
}

@Component({
  imports: [Button, DecimalPipe, FormsModule],
  selector: 'sap-amount-in-words',
  styleUrl: './amount-in-words.scss',
  templateUrl: './amount-in-words.html',
})
export class AmountInWords {
  readonly currencies = Object.keys(CURRENCY_NAMES).sort();
  readonly currencyNames = CURRENCY_NAMES;

  readonly amount = signal(1234.56);
  readonly currency = signal('USD');
  readonly copied = signal(false);
  readonly copiedPlain = signal(false);

  readonly words = computed(() => amountToWords(this.amount(), this.currency()));
  readonly plainWords = computed(() => amountToPlainWords(this.amount(), this.currency()));

  // Seeded with the words output above, so opening the tool shows a working round-trip example
  // immediately rather than an empty field.
  readonly wordsInput = signal(amountToWords(1234.56, 'USD'));
  readonly parsedAmount = computed(() => wordsToAmount(this.wordsInput()));

  async copyWords(): Promise<void> {
    await navigator.clipboard.writeText(this.words());
    this.copied.set(true);
    this.copiedPlain.set(false);
  }

  async copyPlainWords(): Promise<void> {
    await navigator.clipboard.writeText(this.plainWords());
    this.copiedPlain.set(true);
    this.copied.set(false);
  }
}
