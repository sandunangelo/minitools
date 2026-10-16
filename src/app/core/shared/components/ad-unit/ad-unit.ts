import { AfterViewInit, Component, input } from '@angular/core';
import { environment } from '../../../../../environments/environment';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

@Component({
  selector: 'sap-ad-unit',
  styleUrl: './ad-unit.scss',
  templateUrl: './ad-unit.html',
})
export class AdUnit implements AfterViewInit {
  readonly slot = input.required<string>();
  readonly format = input('auto');
  readonly fullWidthResponsive = input(true);

  readonly adsenseEnabled = environment.adsense.enabled && !!environment.adsense.client;
  readonly client = environment.adsense.client;

  ngAfterViewInit(): void {
    if (!this.adsenseEnabled) {
      return;
    }
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      // Ad blockers routinely throw here (adsbygoogle missing/blocked) — never let that
      // take down the rest of the page.
    }
  }
}
