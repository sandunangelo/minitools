import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  isDevMode,
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { AdsenseService } from './core/shared/services/adsense.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(() => inject(AdsenseService).loadScript()),
    // Native browser View Transitions for route changes — a soft cross-fade between pages.
    // No custom animation code needed either way; see src/styles.scss for the light crossfade
    // tuning on ::view-transition-old/new, and the `animate.enter`/`animate.leave` template
    // bindings used across pages — both are native Angular/browser primitives, independent of
    // the legacy `@angular/animations` package (no longer a dependency of this app).
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withFetch()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
