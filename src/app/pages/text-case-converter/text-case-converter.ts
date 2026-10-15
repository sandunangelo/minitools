import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../core/shared/components/button/button';
import { PageHeader } from '../../core/shared/components/page-header/page-header';

/** Splits on whitespace/hyphens/underscores AND camelCase boundaries, so pasting already-cased
 *  text (e.g. "helloWorld" or "hello-world") still converts cleanly to any other case. */
function splitWords(text: string): string[] {
  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[\s_-]+/)
    .filter(Boolean);
}

function toTitleCase(text: string): string {
  return text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function toSentenceCase(text: string): string {
  const lower = text.toLowerCase();
  return lower.replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
}

function toCamelCase(text: string): string {
  return splitWords(text)
    .map((word, i) => (i === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1).toLowerCase()))
    .join('');
}

function toPascalCase(text: string): string {
  return splitWords(text)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function toSnakeCase(text: string): string {
  return splitWords(text)
    .map((word) => word.toLowerCase())
    .join('_');
}

function toKebabCase(text: string): string {
  return splitWords(text)
    .map((word) => word.toLowerCase())
    .join('-');
}

interface CaseFormat {
  id: string;
  label: string;
  convert: (text: string) => string;
}

const FORMATS: CaseFormat[] = [
  { id: 'upper', label: 'UPPERCASE', convert: (t) => t.toUpperCase() },
  { id: 'lower', label: 'lowercase', convert: (t) => t.toLowerCase() },
  { id: 'title', label: 'Title Case', convert: toTitleCase },
  { id: 'sentence', label: 'Sentence case', convert: toSentenceCase },
  { id: 'camel', label: 'camelCase', convert: toCamelCase },
  { id: 'pascal', label: 'PascalCase', convert: toPascalCase },
  { id: 'snake', label: 'snake_case', convert: toSnakeCase },
  { id: 'kebab', label: 'kebab-case', convert: toKebabCase },
];

@Component({
  imports: [Button, FormsModule, PageHeader],
  selector: 'sap-text-case-converter',
  styleUrl: './text-case-converter.scss',
  templateUrl: './text-case-converter.html',
})
export class TextCaseConverter {
  readonly text = signal('');
  readonly copied = signal('');

  readonly formats = FORMATS;
  readonly results = computed(() => {
    const text = this.text();
    return this.formats.map((format) => ({ ...format, value: text ? format.convert(text) : '' }));
  });

  async copy(id: string, value: string): Promise<void> {
    if (!value) {
      return;
    }
    await navigator.clipboard.writeText(value);
    this.copied.set(id);
  }

  clear(): void {
    this.text.set('');
    this.copied.set('');
  }
}
