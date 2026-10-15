import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AmountInWords } from '../amount-in-words/amount-in-words';
import { ExchangeRates } from '../exchange-rates/exchange-rates';
import { PageHeader } from '../../core/shared/components/page-header/page-header';

type Subtool = 'exchange-rates' | 'amount-in-words';

@Component({
  imports: [AmountInWords, ExchangeRates, PageHeader],
  selector: 'sap-financial',
  styleUrl: './financial.scss',
  templateUrl: './financial.html',
})
export class Financial {
  // Lets the Sitemap page's subtool links (?tab=amount-in-words) land directly on that subtool
  // instead of always opening to the default — read once on construction, same as a normal
  // route param would be; this page doesn't need to react to the query param changing while
  // already open, since nothing else on it ever rewrites the URL itself.
  private readonly route = inject(ActivatedRoute);
  readonly activeSubtool = signal<Subtool>(
    this.route.snapshot.queryParamMap.get('tab') === 'amount-in-words' ? 'amount-in-words' : 'exchange-rates',
  );
}
