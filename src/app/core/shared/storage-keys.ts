// Single source of truth for localStorage keys that tool pages persist user selections under.
// Shared between each page (which reads/writes its own key) and the navbar's "clear saved tool
// data" settings panel (src/app/app.ts), which needs the key without importing the page itself —
// that page is lazy-loaded, and importing it from the eagerly-loaded app shell would pull its
// whole chunk into the main bundle, defeating route-level code splitting.
export const EXCHANGE_RATES_STORAGE_KEY = 'minitools.exchange-rates.selection.v1';
export const WORLD_CLOCK_STORAGE_KEY = 'minitools.world-clock.zones.v1';
export const COLOR_CONVERTER_STORAGE_KEY = 'minitools.color-converter.history.v1';
export const TOOL_ORDER_STORAGE_KEY = 'minitools.tool-order.v1';
export const DASHBOARD_WIDGETS_STORAGE_KEY = 'minitools.dashboard-widgets.v1';
