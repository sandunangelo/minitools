import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'financial',
    loadComponent: () => import('./pages/financial/financial').then((m) => m.Financial),
  },
  {
    // Exchange Rates is now the "Exchange Rates" subtool inside Financial, not its own page —
    // kept as a redirect so an old bookmark/history entry for it still lands somewhere useful.
    path: 'exchange-rates',
    redirectTo: 'financial',
  },
  {
    path: 'world-clock',
    loadComponent: () => import('./pages/world-clock/world-clock').then((m) => m.WorldClock),
  },
  {
    path: 'unit-converter',
    loadComponent: () => import('./pages/unit-converter/unit-converter').then((m) => m.UnitConverter),
  },
  {
    path: 'bmi-calculator',
    loadComponent: () => import('./pages/bmi-calculator/bmi-calculator').then((m) => m.BmiCalculator),
  },
  {
    path: 'password-generator',
    loadComponent: () =>
      import('./pages/password-generator/password-generator').then((m) => m.PasswordGenerator),
  },
  {
    path: 'color-converter',
    loadComponent: () => import('./pages/color-converter/color-converter').then((m) => m.ColorConverter),
  },
  {
    path: 'text-case-converter',
    loadComponent: () =>
      import('./pages/text-case-converter/text-case-converter').then((m) => m.TextCaseConverter),
  },
  {
    path: 'word-counter',
    loadComponent: () => import('./pages/word-counter/word-counter').then((m) => m.WordCounter),
  },
  {
    path: 'text-converters',
    loadComponent: () => import('./pages/text-converters/text-converters').then((m) => m.TextConverters),
  },
  {
    // JSON Formatter is now the "JSON Formatter" subtool inside Text Converters, not its own
    // page — kept as a redirect so an old bookmark/history entry for it still lands somewhere useful.
    path: 'json-formatter',
    redirectTo: 'text-converters',
  },
  {
    path: 'tip-calculator',
    loadComponent: () => import('./pages/tip-calculator/tip-calculator').then((m) => m.TipCalculator),
  },
  {
    path: 'string-codec',
    loadComponent: () => import('./pages/string-codec/string-codec').then((m) => m.StringCodec),
  },
  {
    path: 'loading-indicator',
    loadComponent: () => import('./pages/loading-indicator/loading-indicator').then((m) => m.LoadingIndicator),
  },
  {
    path: 'sitemap',
    loadComponent: () => import('./pages/sitemap/sitemap').then((m) => m.Sitemap),
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq').then((m) => m.Faq),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
