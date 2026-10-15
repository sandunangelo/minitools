import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../core/shared/components/button/button';
import { EXCHANGE_RATES_STORAGE_KEY as STORAGE_KEY } from '../../core/shared/storage-keys';

const DEFAULT_CURRENCIES = ['EUR', 'GBP', 'JPY', 'AUD', 'INR'];

/**
 * ISO 4217 code -> display name, for every currency `open.er-api.com` prices (166 at last
 * count). The old data source (Frankfurter/ECB) only covered ~30 major currencies *and*
 * conveniently handed back names with its rates in the same call — this broader source only
 * gives codes, so names are embedded statically here instead (standard, effectively-static
 * reference data, the same call made for `ZONE_COUNTRY_NAMES` in the World Clock page).
 * Exported for reuse by the Amount in Words subtool (both live under the Financial hub).
 */
export const CURRENCY_NAMES: Record<string, string> = {
  AED: 'UAE Dirham', AFN: 'Afghan Afghani', ALL: 'Albanian Lek', AMD: 'Armenian Dram',
  ANG: 'Netherlands Antillean Guilder', AOA: 'Angolan Kwanza', ARS: 'Argentine Peso',
  AUD: 'Australian Dollar', AWG: 'Aruban Florin', AZN: 'Azerbaijani Manat',
  BAM: 'Bosnia-Herzegovina Convertible Mark', BBD: 'Barbadian Dollar', BDT: 'Bangladeshi Taka',
  BGN: 'Bulgarian Lev', BHD: 'Bahraini Dinar', BIF: 'Burundian Franc', BMD: 'Bermudan Dollar',
  BND: 'Brunei Dollar', BOB: 'Bolivian Boliviano', BRL: 'Brazilian Real', BSD: 'Bahamian Dollar',
  BTN: 'Bhutanese Ngultrum', BWP: 'Botswanan Pula', BYN: 'Belarusian Ruble', BZD: 'Belize Dollar',
  CAD: 'Canadian Dollar', CDF: 'Congolese Franc', CHF: 'Swiss Franc',
  CLF: 'Chilean Unit of Account (UF)', CLP: 'Chilean Peso', CNH: 'Chinese Yuan (Offshore)',
  CNY: 'Chinese Yuan', COP: 'Colombian Peso', CRC: 'Costa Rican Colón', CUP: 'Cuban Peso',
  CVE: 'Cape Verdean Escudo', CZK: 'Czech Koruna', DJF: 'Djiboutian Franc', DKK: 'Danish Krone',
  DOP: 'Dominican Peso', DZD: 'Algerian Dinar', EGP: 'Egyptian Pound', ERN: 'Eritrean Nakfa',
  ETB: 'Ethiopian Birr', EUR: 'Euro', FJD: 'Fijian Dollar', FKP: 'Falkland Islands Pound',
  FOK: 'Faroese Króna', GBP: 'British Pound', GEL: 'Georgian Lari', GGP: 'Guernsey Pound',
  GHS: 'Ghanaian Cedi', GIP: 'Gibraltar Pound', GMD: 'Gambian Dalasi', GNF: 'Guinean Franc',
  GTQ: 'Guatemalan Quetzal', GYD: 'Guyanaese Dollar', HKD: 'Hong Kong Dollar',
  HNL: 'Honduran Lempira', HRK: 'Croatian Kuna', HTG: 'Haitian Gourde', HUF: 'Hungarian Forint',
  IDR: 'Indonesian Rupiah', ILS: 'Israeli New Shekel', IMP: 'Isle of Man Pound',
  INR: 'Indian Rupee', IQD: 'Iraqi Dinar', IRR: 'Iranian Rial', ISK: 'Icelandic Króna',
  JEP: 'Jersey Pound', JMD: 'Jamaican Dollar', JOD: 'Jordanian Dinar', JPY: 'Japanese Yen',
  KES: 'Kenyan Shilling', KGS: 'Kyrgystani Som', KHR: 'Cambodian Riel', KID: 'Kiribati Dollar',
  KMF: 'Comorian Franc', KRW: 'South Korean Won', KWD: 'Kuwaiti Dinar',
  KYD: 'Cayman Islands Dollar', KZT: 'Kazakhstani Tenge', LAK: 'Laotian Kip',
  LBP: 'Lebanese Pound', LKR: 'Sri Lankan Rupee', LRD: 'Liberian Dollar', LSL: 'Lesotho Loti',
  LYD: 'Libyan Dinar', MAD: 'Moroccan Dirham', MDL: 'Moldovan Leu', MGA: 'Malagasy Ariary',
  MKD: 'Macedonian Denar', MMK: 'Myanma Kyat', MNT: 'Mongolian Tugrik', MOP: 'Macanese Pataca',
  MRU: 'Mauritanian Ouguiya', MUR: 'Mauritian Rupee', MVR: 'Maldivian Rufiyaa',
  MWK: 'Malawian Kwacha', MXN: 'Mexican Peso', MYR: 'Malaysian Ringgit',
  MZN: 'Mozambican Metical', NAD: 'Namibian Dollar', NGN: 'Nigerian Naira',
  NIO: 'Nicaraguan Córdoba', NOK: 'Norwegian Krone', NPR: 'Nepalese Rupee',
  NZD: 'New Zealand Dollar', OMR: 'Omani Rial', PAB: 'Panamanian Balboa', PEN: 'Peruvian Sol',
  PGK: 'Papua New Guinean Kina', PHP: 'Philippine Peso', PKR: 'Pakistani Rupee',
  PLN: 'Polish Złoty', PYG: 'Paraguayan Guarani', QAR: 'Qatari Rial', RON: 'Romanian Leu',
  RSD: 'Serbian Dinar', RUB: 'Russian Ruble', RWF: 'Rwandan Franc', SAR: 'Saudi Riyal',
  SBD: 'Solomon Islands Dollar', SCR: 'Seychellois Rupee', SDG: 'Sudanese Pound',
  SEK: 'Swedish Krona', SGD: 'Singapore Dollar', SHP: 'Saint Helena Pound',
  SLE: 'Sierra Leonean Leone', SLL: 'Sierra Leonean Leone (old)', SOS: 'Somali Shilling',
  SRD: 'Surinamese Dollar', SSP: 'South Sudanese Pound', STN: 'São Tomé & Príncipe Dobra',
  SYP: 'Syrian Pound', SZL: 'Swazi Lilangeni', THB: 'Thai Baht', TJS: 'Tajikistani Somoni',
  TMT: 'Turkmenistani Manat', TND: 'Tunisian Dinar', TOP: 'Tongan Paʻanga', TRY: 'Turkish Lira',
  TTD: 'Trinidad & Tobago Dollar', TVD: 'Tuvaluan Dollar', TWD: 'New Taiwan Dollar',
  TZS: 'Tanzanian Shilling', UAH: 'Ukrainian Hryvnia', UGX: 'Ugandan Shilling',
  USD: 'US Dollar', UYU: 'Uruguayan Peso', UZS: 'Uzbekistani Som', VES: 'Venezuelan Bolívar',
  VND: 'Vietnamese Đồng', VUV: 'Vanuatu Vatu', WST: 'Samoan Tala',
  XAF: 'Central African CFA Franc', XCD: 'East Caribbean Dollar', XCG: 'Caribbean Guilder',
  XDR: 'Special Drawing Rights', XOF: 'West African CFA Franc', XPF: 'CFP Franc',
  YER: 'Yemeni Rial', ZAR: 'South African Rand', ZMW: 'Zambian Kwacha',
  ZWG: 'Zimbabwe Gold', ZWL: 'Zimbabwean Dollar (old)',
};

/**
 * Currency code -> representative ISO 3166-1 alpha-2 region, for a row's flag. Rendered as an
 * `<img>` pointing at a static SVG under `public/flags/` (copied once from the `flag-icons` npm
 * package's `flags/4x3/` folder — the package itself isn't a runtime dependency, just the
 * one-time source of these files). Unicode flag emoji were tried first, but Chromium on Windows
 * deliberately renders regional-indicator flag emoji as plain two-letter codes instead of actual
 * flag pictographs regardless of OS font support, so an actual image is needed for this to look
 * like a flag on every platform. Most currencies map cleanly to a single issuing country; a
 * handful are shared across several countries with no single natural flag (the CFA francs, East
 * Caribbean dollar, IMF's SDR, etc.) — those are left out and fall back to `flags/xx.svg` (the
 * flag-icons package's own "unknown flag" placeholder) in `flagSrcFor` below, rather than
 * picking one member country arbitrarily.
 */
const CURRENCY_REGION: Record<string, string> = {
  AED: 'AE', AFN: 'AF', ALL: 'AL', AMD: 'AM', ANG: 'CW', AOA: 'AO', ARS: 'AR',
  AUD: 'AU', AWG: 'AW', AZN: 'AZ', BAM: 'BA', BBD: 'BB', BDT: 'BD', BGN: 'BG',
  BHD: 'BH', BIF: 'BI', BMD: 'BM', BND: 'BN', BOB: 'BO', BRL: 'BR', BSD: 'BS',
  BTN: 'BT', BWP: 'BW', BYN: 'BY', BZD: 'BZ', CAD: 'CA', CDF: 'CD', CHF: 'CH',
  CLF: 'CL', CLP: 'CL', CNH: 'CN', CNY: 'CN', COP: 'CO', CRC: 'CR', CUP: 'CU',
  CVE: 'CV', CZK: 'CZ', DJF: 'DJ', DKK: 'DK', DOP: 'DO', DZD: 'DZ', EGP: 'EG',
  ERN: 'ER', ETB: 'ET', EUR: 'EU', FJD: 'FJ', FKP: 'FK', FOK: 'FO', GBP: 'GB',
  GEL: 'GE', GGP: 'GG', GHS: 'GH', GIP: 'GI', GMD: 'GM', GNF: 'GN', GTQ: 'GT',
  GYD: 'GY', HKD: 'HK', HNL: 'HN', HRK: 'HR', HTG: 'HT', HUF: 'HU', IDR: 'ID',
  ILS: 'IL', IMP: 'IM', INR: 'IN', IQD: 'IQ', IRR: 'IR', ISK: 'IS', JEP: 'JE',
  JMD: 'JM', JOD: 'JO', JPY: 'JP', KES: 'KE', KGS: 'KG', KHR: 'KH', KID: 'KI',
  KMF: 'KM', KRW: 'KR', KWD: 'KW', KYD: 'KY', KZT: 'KZ', LAK: 'LA', LBP: 'LB',
  LKR: 'LK', LRD: 'LR', LSL: 'LS', LYD: 'LY', MAD: 'MA', MDL: 'MD', MGA: 'MG',
  MKD: 'MK', MMK: 'MM', MNT: 'MN', MOP: 'MO', MRU: 'MR', MUR: 'MU', MVR: 'MV',
  MWK: 'MW', MXN: 'MX', MYR: 'MY', MZN: 'MZ', NAD: 'NA', NGN: 'NG', NIO: 'NI',
  NOK: 'NO', NPR: 'NP', NZD: 'NZ', OMR: 'OM', PAB: 'PA', PEN: 'PE', PGK: 'PG',
  PHP: 'PH', PKR: 'PK', PLN: 'PL', PYG: 'PY', QAR: 'QA', RON: 'RO', RSD: 'RS',
  RUB: 'RU', RWF: 'RW', SAR: 'SA', SBD: 'SB', SCR: 'SC', SDG: 'SD', SEK: 'SE',
  SGD: 'SG', SHP: 'SH', SLE: 'SL', SLL: 'SL', SOS: 'SO', SRD: 'SR', SSP: 'SS',
  STN: 'ST', SYP: 'SY', SZL: 'SZ', THB: 'TH', TJS: 'TJ', TMT: 'TM', TND: 'TN',
  TOP: 'TO', TRY: 'TR', TTD: 'TT', TVD: 'TV', TWD: 'TW', TZS: 'TZ', UAH: 'UA',
  UGX: 'UG', USD: 'US', UYU: 'UY', UZS: 'UZ', VES: 'VE', VND: 'VN', VUV: 'VU',
  WST: 'WS', YER: 'YE', ZAR: 'ZA', ZMW: 'ZM', ZWG: 'ZW', ZWL: 'ZW',
};

/** Static flag SVG path for a currency (e.g. "flags/lk.svg") — falls back to "flags/xx.svg"
 *  (an "unknown flag" placeholder) for currencies with no single representative country. */
function flagSrcFor(code: string): string {
  const region = CURRENCY_REGION[code];
  return `flags/${(region ?? 'xx').toLowerCase()}.svg`;
}

interface RatesResponse {
  result: string;
  base_code: string;
  time_last_update_utc: string;
  rates: Record<string, number>;
}

interface CurrencyRow {
  code: string;
  name: string;
  flagSrc: string;
  converted: number;
  rate: number;
}

interface StoredSelection {
  amount: number;
  base: string;
  currencies: string[];
  customOrder: string[] | null;
}

/** Reads the last-used amount/base/pinned currencies (+ any manual drag order) back from
 *  localStorage. Never throws. `customOrder` defaults to null for selections saved before it
 *  existed, rather than failing validation on the whole entry. */
function loadStoredSelection(): StoredSelection | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.amount !== 'number' ||
      !(parsed.amount > 0) ||
      typeof parsed?.base !== 'string' ||
      !Array.isArray(parsed?.currencies) ||
      parsed.currencies.length === 0 ||
      !parsed.currencies.every((c: unknown) => typeof c === 'string')
    ) {
      return null;
    }
    const customOrder =
      Array.isArray(parsed?.customOrder) && parsed.customOrder.every((c: unknown) => typeof c === 'string')
        ? (parsed.customOrder as string[])
        : null;
    return { amount: parsed.amount, base: parsed.base, currencies: parsed.currencies, customOrder };
  } catch {
    return null;
  }
}

/** Persists the current amount/base/pinned currencies/drag order. Storage failures (e.g.
 *  private browsing quota) are non-critical, so they're swallowed rather than surfaced. */
function saveStoredSelection(state: StoredSelection): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore - persistence is a nice-to-have, not required for the page to function.
  }
}

@Component({
  imports: [Button, DecimalPipe, FormsModule],
  selector: 'sap-exchange-rates',
  styleUrl: './exchange-rates.scss',
  templateUrl: './exchange-rates.html',
})
export class ExchangeRates {
  private readonly http = inject(HttpClient);
  private readonly stored = loadStoredSelection();

  readonly currencyNames = CURRENCY_NAMES;
  readonly allCurrencies = Object.keys(CURRENCY_NAMES).sort();

  /** `{code, label}` ("USD - US Dollar") for every known currency, for the add-currency search
   *  box — same shape/spirit as World Clock's `zoneSearchOptions`. */
  readonly currencySearchOptions = this.allCurrencies.map((code) => ({
    code,
    label: `${code} - ${CURRENCY_NAMES[code]}`,
  }));

  readonly amount = signal(this.stored?.amount ?? 1);
  readonly base = signal(this.stored?.base ?? 'USD');
  readonly currencies = signal<string[]>(this.stored?.currencies ?? [...DEFAULT_CURRENCIES]);
  readonly currencyToAdd = signal('');

  // Manual row order from dragging; null means "not customized yet, auto-sort alphabetically".
  private readonly customOrder = signal<string[] | null>(this.stored?.customOrder ?? null);
  readonly dragOverCode = signal<string | null>(null);
  private dragCode: string | null = null;

  private readonly rawRows = signal<Omit<CurrencyRow, 'name' | 'flagSrc'>[]>([]);
  readonly asOfDate = signal('');
  readonly loading = signal(false);
  readonly error = signal('');

  private readonly autoSortedCurrencies = computed(() => [...this.currencies()].sort());

  /** Auto-sorted (alphabetical), unless the user has dragged rows into a custom order. New
   *  currencies get appended at the end; removed ones just drop out — same reconciliation as
   *  World Clock's `orderedZones`. */
  readonly orderedCurrencies = computed(() => {
    const custom = this.customOrder();
    if (!custom) {
      return this.autoSortedCurrencies();
    }
    const currencySet = new Set(this.currencies());
    const kept = custom.filter((code) => currencySet.has(code));
    const missing = this.currencies().filter((code) => !kept.includes(code));
    return [...kept, ...missing];
  });

  // Row order follows `orderedCurrencies` while the actual rate data comes from whatever
  // `refresh()` last fetched (keyed by code so the two can vary independently).
  readonly rows = computed<CurrencyRow[]>(() => {
    const byCode = new Map(this.rawRows().map((row) => [row.code, row]));
    return this.orderedCurrencies()
      .map((code) => byCode.get(code))
      .filter((row): row is Omit<CurrencyRow, 'name' | 'flagSrc'> => !!row)
      .map((row) => ({
        ...row,
        name: CURRENCY_NAMES[row.code] ?? row.code,
        flagSrc: flagSrcFor(row.code),
      }));
  });

  constructor() {
    this.refresh();

    effect(() => {
      saveStoredSelection({
        amount: this.amount(),
        base: this.base(),
        currencies: this.currencies(),
        customOrder: this.customOrder(),
      });
    });
  }

  refresh(): void {
    const amount = this.amount();
    const base = this.base();
    const currencies = this.currencies();

    if (!amount || amount <= 0 || currencies.length === 0) {
      this.rawRows.set([]);
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.http.get<RatesResponse>(`https://open.er-api.com/v6/latest/${base}`).subscribe({
      next: (data) => {
        if (data.result !== 'success') {
          this.rawRows.set([]);
          this.error.set('Could not fetch rates for that selection.');
          this.loading.set(false);
          return;
        }
        this.asOfDate.set(
          new Date(data.time_last_update_utc).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
        );
        this.rawRows.set(
          currencies.map((code) => {
            const perUnit = code === base ? 1 : (data.rates[code] ?? NaN);
            return { code, converted: perUnit * amount, rate: perUnit };
          }),
        );
        this.loading.set(false);
      },
      error: () => {
        this.rawRows.set([]);
        this.error.set('Could not fetch rates for that selection.');
        this.loading.set(false);
      },
    });
  }

  addCurrency(): void {
    // Mirrors World Clock's addZone(): the datalist option's value is the display label
    // ("USD US Dollar"), so resolve it back to a code, falling back to treating the typed text
    // as a code directly (upper-cased) so power users can still type a bare code.
    const typed = this.currencyToAdd().trim();
    const match = this.currencySearchOptions.find((option) => option.label === typed);
    const code = (match?.code ?? typed).toUpperCase();
    if (this.currencyNames[code] && !this.currencies().includes(code)) {
      this.currencies.update((list) => [...list, code]);
      this.currencyToAdd.set('');
      this.refresh();
    }
  }

  removeCurrency(code: string): void {
    this.currencies.update((list) => list.filter((c) => c !== code));
    this.refresh();
  }

  onDragStart(event: DragEvent, code: string): void {
    this.dragCode = code;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', code);
      const row = (event.currentTarget as HTMLElement).closest('.currency-row') as HTMLElement | null;
      if (row) {
        event.dataTransfer.setDragImage(row, 20, 20);
      }
    }
  }

  onDragOver(event: DragEvent, code: string): void {
    event.preventDefault();
    if (this.dragCode && this.dragCode !== code) {
      this.dragOverCode.set(code);
    }
  }

  onDrop(event: DragEvent, targetCode: string): void {
    event.preventDefault();
    const source = this.dragCode;
    this.dragOverCode.set(null);
    if (!source || source === targetCode) {
      return;
    }
    const current = this.orderedCurrencies();
    const withoutSource = current.filter((code) => code !== source);
    const targetIndex = withoutSource.indexOf(targetCode);
    withoutSource.splice(targetIndex, 0, source);
    this.customOrder.set(withoutSource);
    this.dragCode = null;
  }

  onDragEnd(): void {
    this.dragCode = null;
    this.dragOverCode.set(null);
  }
}
