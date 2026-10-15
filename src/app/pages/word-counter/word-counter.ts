import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../core/shared/components/button/button';
import { PageHeader } from '../../core/shared/components/page-header/page-header';

const AVERAGE_WORDS_PER_MINUTE = 200;

interface Stats {
  words: number;
  charsWithSpaces: number;
  charsNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingMinutes: number;
}

@Component({
  imports: [Button, DecimalPipe, FormsModule, PageHeader],
  selector: 'sap-word-counter',
  styleUrl: './word-counter.scss',
  templateUrl: './word-counter.html',
})
export class WordCounter {
  readonly text = signal('');

  readonly stats = computed<Stats>(() => {
    const text = this.text();
    const trimmed = text.trim();

    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    // A run of .!? counts as one sentence end, so "Wait... really?!" is 1 sentence, not 5.
    const sentences = trimmed ? (trimmed.match(/[^.!?]*[.!?]+|[^.!?]+$/g)?.filter((s) => s.trim()).length ?? 0) : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
    const readingMinutes = words === 0 ? 0 : Math.max(1, Math.ceil(words / AVERAGE_WORDS_PER_MINUTE));

    return { words, charsWithSpaces, charsNoSpaces, sentences, paragraphs, readingMinutes };
  });

  clear(): void {
    this.text.set('');
  }
}
