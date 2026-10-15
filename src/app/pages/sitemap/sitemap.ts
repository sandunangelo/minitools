import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '../../core/shared/components/page-header/page-header';
import { TOOLS } from '../../core/shared/models/tool';

interface SitemapChild {
  id: string;
  label: string;
  icon: string;
  queryParams: Record<string, string>;
}

interface SitemapEntry {
  id: string;
  title: string;
  icon: string;
  description: string;
  route: string;
  children?: SitemapChild[];
}

// The two "hub" tools each bundle a couple of subtools behind their own internal tab switcher —
// not modeled in TOOLS itself (each hub is one flat route there), so the hierarchy is hand-
// maintained here, purely for this overview page. The query params let these child links land
// directly on the right subtool rather than just the hub's own default one.
const SUBTOOLS: Record<string, SitemapChild[]> = {
  financial: [
    { id: 'exchange-rates', label: 'Exchange Rates', icon: '💱', queryParams: { tab: 'exchange-rates' } },
    { id: 'amount-in-words', label: 'Amount in Words', icon: '🔤', queryParams: { tab: 'amount-in-words' } },
  ],
  'text-converters': [
    { id: 'json-formatter', label: 'JSON Formatter', icon: '🧾', queryParams: { tab: 'json-formatter' } },
    { id: 'xml-formatter', label: 'XML Formatter', icon: '🏷️', queryParams: { tab: 'xml-formatter' } },
  ],
};

const PAGES: SitemapEntry[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: '🧰',
    description: 'Home — browse every tool, search, and pin widgets.',
    route: '/',
  },
  ...TOOLS.map((tool) => ({
    id: tool.id,
    title: tool.title,
    icon: tool.icon,
    description: tool.description,
    route: tool.route,
    children: SUBTOOLS[tool.id],
  })),
  {
    id: 'sitemap',
    title: 'Sitemap',
    icon: '🗺️',
    description: 'This page — a full map of every page in Minitools.',
    route: '/sitemap',
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: '❓',
    description: 'Answers to common questions about using Minitools.',
    route: '/faq',
  },
];

@Component({
  imports: [RouterLink, PageHeader],
  selector: 'sap-sitemap',
  styleUrl: './sitemap.scss',
  templateUrl: './sitemap.html',
})
export class Sitemap {
  readonly pages = PAGES;

  // Hub entries default open — few enough nodes overall (12 tools, 4 subtools) that showing
  // everything at a glance is more useful than requiring a click before any subtool is visible.
  readonly expandedIds = signal<ReadonlySet<string>>(new Set(Object.keys(SUBTOOLS)));

  isExpanded(id: string): boolean {
    return this.expandedIds().has(id);
  }

  toggle(id: string): void {
    this.expandedIds.update((ids) => {
      const next = new Set(ids);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }
}
