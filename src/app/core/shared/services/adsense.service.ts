import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

/** Injects Google's AdSense loader script into <head> at most once, and only once a real
 *  client id is configured in environment.adsense — otherwise a no-op, so local dev and an
 *  unconfigured deploy never make real AdSense network calls. */
@Injectable({ providedIn: 'root' })
export class AdsenseService {
  private injected = false;

  loadScript(): void {
    if (this.injected || !environment.adsense.enabled || !environment.adsense.client) {
      return;
    }
    this.injected = true;
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${environment.adsense.client}`;
    document.head.appendChild(script);
  }
}
