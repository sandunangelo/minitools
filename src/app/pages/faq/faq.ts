import { Component, signal } from '@angular/core';
import { PageHeader } from '../../core/shared/components/page-header/page-header';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'What is Minitools?',
    answer:
      'A personal collection of small, focused utilities — calculators, converters, formatters, and generators — all running entirely in your browser, with no sign-up and no backend server.',
  },
  {
    question: 'Is my data sent anywhere, or stored on a server?',
    answer:
      "No. Every tool runs entirely client-side. Anything remembered between visits (pinned currencies, clock zones, color history, tool order, dashboard widgets) is saved only in your own browser's local storage — it never leaves your device, and there's no account or server involved.",
  },
  {
    question: 'How do I clear the data a tool has saved?',
    answer:
      'Click the ⚙️ gear icon in the top-right corner of any page. It opens a panel listing every tool that currently has saved data, how much, and a button to clear whichever ones you choose.',
  },
  {
    question: 'What are the "widgets" on the dashboard?',
    answer:
      "Click the ⭐ on any tool's tile to pin a live, fully-working miniature version of it right on your dashboard — handy for quick, frequent tasks without opening the full page. Drag a widget's ⠿ handle to reorder it, and click ✕ to unpin it. A widget is just as functional as the full tool, only more compact.",
  },
  {
    question: 'How do I reorder tools, or set a favorite?',
    answer:
      'Drag any tile on the dashboard, or any tab in the top quick-link bar, to reorder it — both share the same order and remember it for next time.',
  },
  {
    question: "What's the colored badge that shows up when I search the dashboard?",
    answer:
      "That's a small sentiment readout of whatever you've typed, just for fun — it has no effect on which tools match your search.",
  },
  {
    question: 'Is it safe to use the JWT tool with a real secret?',
    answer:
      "String Encode/Decode's JWT signing and verification run entirely in your browser via the Web Crypto API — your secret is never sent anywhere. That said, treat any online or offline tool with the same caution you'd use anywhere you type a genuinely sensitive production secret.",
  },
  {
    question: 'Can I use the HTML/CSS from the Loading Indicator Generator in my own project?',
    answer:
      'Yes — the generated code is plain, dependency-free HTML and CSS with no attribution required. Pick a design, color, and size, then copy the HTML and CSS panels straight into your project.',
  },
  {
    question: "I can't find a tool I used before — where did it go?",
    answer:
      'Check the Sitemap page (🗺️ in the top navbar) for a full list of every tool and subtool. A couple of tools are grouped: Exchange Rates and Amount in Words both live inside "Financial", and JSON Formatter and XML Formatter both live inside "Text Converters".',
  },
  {
    question: 'Does Minitools work on mobile?',
    answer:
      'Yes — every page adapts its layout for narrower screens, though a few tools (like the side-by-side JSON/XML editors) are naturally more comfortable on a larger screen.',
  },
];

@Component({
  imports: [PageHeader],
  selector: 'sap-faq',
  styleUrl: './faq.scss',
  templateUrl: './faq.html',
})
export class Faq {
  readonly faqs = FAQS;
  readonly openQuestions = signal<ReadonlySet<number>>(new Set());

  isOpen(index: number): boolean {
    return this.openQuestions().has(index);
  }

  toggle(index: number): void {
    this.openQuestions.update((open) => {
      const next = new Set(open);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }
}
