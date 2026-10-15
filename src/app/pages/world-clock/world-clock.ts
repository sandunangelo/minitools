import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../core/shared/components/button/button';
import { PageHeader } from '../../core/shared/components/page-header/page-header';
import { WORLD_CLOCK_STORAGE_KEY as STORAGE_KEY } from '../../core/shared/storage-keys';

const DEFAULT_ZONES = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'];

/**
 * `Intl.supportedValuesOf('timeZone')` has no zone at a standard offset of GMT-12:00 — the
 * only real-world example (Baker & Howland Islands) is uninhabited and has no IANA zone of its
 * own. IANA's `Etc/GMT+12` fixed-offset zone (note the inverted POSIX sign: "+12" here means
 * UTC-12) covers it correctly and is a valid zone id, just one `supportedValuesOf` doesn't
 * enumerate — so it's added explicitly rather than appearing in `availableZones` naturally.
 * The other ~18 empty half-hour slots between GMT-12:00 and GMT+14:00 have no real zone *or*
 * standard fixed-offset equivalent (Etc/GMT only covers whole hours), so they're left as-is.
 */
const SUPPLEMENTARY_ZONES = ['Etc/GMT+12'];
const SUPPLEMENTARY_ZONE_NAMES: Record<string, string> = { 'Etc/GMT+12': 'Baker Island' };

/**
 * Every IANA zone -> its country's display name, e.g. "America/New_York" -> "United States".
 * There's no browser API for this (`Intl.Locale.prototype.timeZones`, which could derive it
 * from `Intl.DisplayNames`, is Node-only right now — confirmed unsupported even in a current
 * Chromium build), so this is pre-computed from Node's implementation and baked in as static
 * data. Covers all 418 zones `Intl.supportedValuesOf('timeZone')` returns, with zero misses —
 * "UTC" itself is the one notable zone with no country (it's not even in that list; only its
 * alias "Etc/UTC" is), which callers handle by just omitting the country suffix.
 */
const ZONE_COUNTRY_NAMES: Record<string, string> = {
  'Africa/Abidjan': 'Côte d’Ivoire',
  'Africa/Accra': 'Ghana',
  'Africa/Addis_Ababa': 'Ethiopia',
  'Africa/Algiers': 'Algeria',
  'Africa/Asmera': 'Eritrea',
  'Africa/Bamako': 'Mali',
  'Africa/Bangui': 'Central African Republic',
  'Africa/Banjul': 'Gambia',
  'Africa/Bissau': 'Guinea-Bissau',
  'Africa/Blantyre': 'Malawi',
  'Africa/Brazzaville': 'Congo - Brazzaville',
  'Africa/Bujumbura': 'Burundi',
  'Africa/Cairo': 'Egypt',
  'Africa/Casablanca': 'Morocco',
  'Africa/Ceuta': 'Spain',
  'Africa/Conakry': 'Guinea',
  'Africa/Dakar': 'Senegal',
  'Africa/Dar_es_Salaam': 'Tanzania',
  'Africa/Djibouti': 'Djibouti',
  'Africa/Douala': 'Cameroon',
  'Africa/El_Aaiun': 'Western Sahara',
  'Africa/Freetown': 'Sierra Leone',
  'Africa/Gaborone': 'Botswana',
  'Africa/Harare': 'Zimbabwe',
  'Africa/Johannesburg': 'South Africa',
  'Africa/Juba': 'South Sudan',
  'Africa/Kampala': 'Uganda',
  'Africa/Khartoum': 'Sudan',
  'Africa/Kigali': 'Rwanda',
  'Africa/Kinshasa': 'Congo - Kinshasa',
  'Africa/Lagos': 'Nigeria',
  'Africa/Libreville': 'Gabon',
  'Africa/Lome': 'Togo',
  'Africa/Luanda': 'Angola',
  'Africa/Lubumbashi': 'Congo - Kinshasa',
  'Africa/Lusaka': 'Zambia',
  'Africa/Malabo': 'Equatorial Guinea',
  'Africa/Maputo': 'Mozambique',
  'Africa/Maseru': 'Lesotho',
  'Africa/Mbabane': 'Eswatini',
  'Africa/Mogadishu': 'Somalia',
  'Africa/Monrovia': 'Liberia',
  'Africa/Nairobi': 'Kenya',
  'Africa/Ndjamena': 'Chad',
  'Africa/Niamey': 'Niger',
  'Africa/Nouakchott': 'Mauritania',
  'Africa/Ouagadougou': 'Burkina Faso',
  'Africa/Porto-Novo': 'Benin',
  'Africa/Sao_Tome': 'São Tomé & Príncipe',
  'Africa/Tripoli': 'Libya',
  'Africa/Tunis': 'Tunisia',
  'Africa/Windhoek': 'Namibia',
  'America/Adak': 'United States',
  'America/Anchorage': 'United States',
  'America/Anguilla': 'Anguilla',
  'America/Antigua': 'Antigua & Barbuda',
  'America/Araguaina': 'Brazil',
  'America/Argentina/La_Rioja': 'Argentina',
  'America/Argentina/Rio_Gallegos': 'Argentina',
  'America/Argentina/Salta': 'Argentina',
  'America/Argentina/San_Juan': 'Argentina',
  'America/Argentina/San_Luis': 'Argentina',
  'America/Argentina/Tucuman': 'Argentina',
  'America/Argentina/Ushuaia': 'Argentina',
  'America/Aruba': 'Aruba',
  'America/Asuncion': 'Paraguay',
  'America/Bahia': 'Brazil',
  'America/Bahia_Banderas': 'Mexico',
  'America/Barbados': 'Barbados',
  'America/Belem': 'Brazil',
  'America/Belize': 'Belize',
  'America/Blanc-Sablon': 'Canada',
  'America/Boa_Vista': 'Brazil',
  'America/Bogota': 'Colombia',
  'America/Boise': 'United States',
  'America/Buenos_Aires': 'Argentina',
  'America/Cambridge_Bay': 'Canada',
  'America/Campo_Grande': 'Brazil',
  'America/Cancun': 'Mexico',
  'America/Caracas': 'Venezuela',
  'America/Catamarca': 'Argentina',
  'America/Cayenne': 'French Guiana',
  'America/Cayman': 'Cayman Islands',
  'America/Chicago': 'United States',
  'America/Chihuahua': 'Mexico',
  'America/Ciudad_Juarez': 'Mexico',
  'America/Coral_Harbour': 'Canada',
  'America/Cordoba': 'Argentina',
  'America/Costa_Rica': 'Costa Rica',
  'America/Coyhaique': 'Chile',
  'America/Creston': 'Canada',
  'America/Cuiaba': 'Brazil',
  'America/Curacao': 'Curaçao',
  'America/Danmarkshavn': 'Greenland',
  'America/Dawson': 'Canada',
  'America/Dawson_Creek': 'Canada',
  'America/Denver': 'United States',
  'America/Detroit': 'United States',
  'America/Dominica': 'Dominica',
  'America/Edmonton': 'Canada',
  'America/Eirunepe': 'Brazil',
  'America/El_Salvador': 'El Salvador',
  'America/Fort_Nelson': 'Canada',
  'America/Fortaleza': 'Brazil',
  'America/Glace_Bay': 'Canada',
  'America/Godthab': 'Greenland',
  'America/Goose_Bay': 'Canada',
  'America/Grand_Turk': 'Turks & Caicos Islands',
  'America/Grenada': 'Grenada',
  'America/Guadeloupe': 'Guadeloupe',
  'America/Guatemala': 'Guatemala',
  'America/Guayaquil': 'Ecuador',
  'America/Guyana': 'Guyana',
  'America/Halifax': 'Canada',
  'America/Havana': 'Cuba',
  'America/Hermosillo': 'Mexico',
  'America/Indiana/Knox': 'United States',
  'America/Indiana/Marengo': 'United States',
  'America/Indiana/Petersburg': 'United States',
  'America/Indiana/Tell_City': 'United States',
  'America/Indiana/Vevay': 'United States',
  'America/Indiana/Vincennes': 'United States',
  'America/Indiana/Winamac': 'United States',
  'America/Indianapolis': 'United States',
  'America/Inuvik': 'Canada',
  'America/Iqaluit': 'Canada',
  'America/Jamaica': 'Jamaica',
  'America/Jujuy': 'Argentina',
  'America/Juneau': 'United States',
  'America/Kentucky/Monticello': 'United States',
  'America/Kralendijk': 'Caribbean Netherlands',
  'America/La_Paz': 'Bolivia',
  'America/Lima': 'Peru',
  'America/Los_Angeles': 'United States',
  'America/Louisville': 'United States',
  'America/Lower_Princes': 'Sint Maarten',
  'America/Maceio': 'Brazil',
  'America/Managua': 'Nicaragua',
  'America/Manaus': 'Brazil',
  'America/Marigot': 'St. Martin',
  'America/Martinique': 'Martinique',
  'America/Matamoros': 'Mexico',
  'America/Mazatlan': 'Mexico',
  'America/Mendoza': 'Argentina',
  'America/Menominee': 'United States',
  'America/Merida': 'Mexico',
  'America/Metlakatla': 'United States',
  'America/Mexico_City': 'Mexico',
  'America/Miquelon': 'St. Pierre & Miquelon',
  'America/Moncton': 'Canada',
  'America/Monterrey': 'Mexico',
  'America/Montevideo': 'Uruguay',
  'America/Montserrat': 'Montserrat',
  'America/Nassau': 'Bahamas',
  'America/New_York': 'United States',
  'America/Nome': 'United States',
  'America/Noronha': 'Brazil',
  'America/North_Dakota/Beulah': 'United States',
  'America/North_Dakota/Center': 'United States',
  'America/North_Dakota/New_Salem': 'United States',
  'America/Ojinaga': 'Mexico',
  'America/Panama': 'Panama',
  'America/Paramaribo': 'Suriname',
  'America/Phoenix': 'United States',
  'America/Port_of_Spain': 'Trinidad & Tobago',
  'America/Port-au-Prince': 'Haiti',
  'America/Porto_Velho': 'Brazil',
  'America/Puerto_Rico': 'Puerto Rico',
  'America/Punta_Arenas': 'Chile',
  'America/Rankin_Inlet': 'Canada',
  'America/Recife': 'Brazil',
  'America/Regina': 'Canada',
  'America/Resolute': 'Canada',
  'America/Rio_Branco': 'Brazil',
  'America/Santarem': 'Brazil',
  'America/Santiago': 'Chile',
  'America/Santo_Domingo': 'Dominican Republic',
  'America/Sao_Paulo': 'Brazil',
  'America/Scoresbysund': 'Greenland',
  'America/Sitka': 'United States',
  'America/St_Barthelemy': 'St. Barthélemy',
  'America/St_Johns': 'Canada',
  'America/St_Kitts': 'St. Kitts & Nevis',
  'America/St_Lucia': 'St. Lucia',
  'America/St_Thomas': 'U.S. Virgin Islands',
  'America/St_Vincent': 'St. Vincent & Grenadines',
  'America/Swift_Current': 'Canada',
  'America/Tegucigalpa': 'Honduras',
  'America/Thule': 'Greenland',
  'America/Tijuana': 'Mexico',
  'America/Toronto': 'Canada',
  'America/Tortola': 'British Virgin Islands',
  'America/Vancouver': 'Canada',
  'America/Whitehorse': 'Canada',
  'America/Winnipeg': 'Canada',
  'America/Yakutat': 'United States',
  'Antarctica/Casey': 'Antarctica',
  'Antarctica/Davis': 'Antarctica',
  'Antarctica/DumontDUrville': 'Antarctica',
  'Antarctica/Macquarie': 'Australia',
  'Antarctica/Mawson': 'Antarctica',
  'Antarctica/McMurdo': 'Antarctica',
  'Antarctica/Palmer': 'Antarctica',
  'Antarctica/Rothera': 'Antarctica',
  'Antarctica/Syowa': 'Antarctica',
  'Antarctica/Troll': 'Antarctica',
  'Antarctica/Vostok': 'Antarctica',
  'Arctic/Longyearbyen': 'Svalbard & Jan Mayen',
  'Asia/Aden': 'Yemen',
  'Asia/Almaty': 'Kazakhstan',
  'Asia/Amman': 'Jordan',
  'Asia/Anadyr': 'Russia',
  'Asia/Aqtau': 'Kazakhstan',
  'Asia/Aqtobe': 'Kazakhstan',
  'Asia/Ashgabat': 'Turkmenistan',
  'Asia/Atyrau': 'Kazakhstan',
  'Asia/Baghdad': 'Iraq',
  'Asia/Bahrain': 'Bahrain',
  'Asia/Baku': 'Azerbaijan',
  'Asia/Bangkok': 'Thailand',
  'Asia/Barnaul': 'Russia',
  'Asia/Beirut': 'Lebanon',
  'Asia/Bishkek': 'Kyrgyzstan',
  'Asia/Brunei': 'Brunei',
  'Asia/Calcutta': 'India',
  'Asia/Chita': 'Russia',
  'Asia/Colombo': 'Sri Lanka',
  'Asia/Damascus': 'Syria',
  'Asia/Dhaka': 'Bangladesh',
  'Asia/Dili': 'Timor-Leste',
  'Asia/Dubai': 'United Arab Emirates',
  'Asia/Dushanbe': 'Tajikistan',
  'Asia/Famagusta': 'Cyprus',
  'Asia/Gaza': 'Palestinian Territories',
  'Asia/Hebron': 'Palestinian Territories',
  'Asia/Hong_Kong': 'Hong Kong SAR China',
  'Asia/Hovd': 'Mongolia',
  'Asia/Irkutsk': 'Russia',
  'Asia/Jakarta': 'Indonesia',
  'Asia/Jayapura': 'Indonesia',
  'Asia/Jerusalem': 'Israel',
  'Asia/Kabul': 'Afghanistan',
  'Asia/Kamchatka': 'Russia',
  'Asia/Karachi': 'Pakistan',
  'Asia/Katmandu': 'Nepal',
  'Asia/Khandyga': 'Russia',
  'Asia/Krasnoyarsk': 'Russia',
  'Asia/Kuala_Lumpur': 'Malaysia',
  'Asia/Kuching': 'Malaysia',
  'Asia/Kuwait': 'Kuwait',
  'Asia/Macau': 'Macao SAR China',
  'Asia/Magadan': 'Russia',
  'Asia/Makassar': 'Indonesia',
  'Asia/Manila': 'Philippines',
  'Asia/Muscat': 'Oman',
  'Asia/Nicosia': 'Cyprus',
  'Asia/Novokuznetsk': 'Russia',
  'Asia/Novosibirsk': 'Russia',
  'Asia/Omsk': 'Russia',
  'Asia/Oral': 'Kazakhstan',
  'Asia/Phnom_Penh': 'Cambodia',
  'Asia/Pontianak': 'Indonesia',
  'Asia/Pyongyang': 'North Korea',
  'Asia/Qatar': 'Qatar',
  'Asia/Qostanay': 'Kazakhstan',
  'Asia/Qyzylorda': 'Kazakhstan',
  'Asia/Rangoon': 'Myanmar (Burma)',
  'Asia/Riyadh': 'Saudi Arabia',
  'Asia/Saigon': 'Vietnam',
  'Asia/Sakhalin': 'Russia',
  'Asia/Samarkand': 'Uzbekistan',
  'Asia/Seoul': 'South Korea',
  'Asia/Shanghai': 'China',
  'Asia/Singapore': 'Singapore',
  'Asia/Srednekolymsk': 'Russia',
  'Asia/Taipei': 'Taiwan',
  'Asia/Tashkent': 'Uzbekistan',
  'Asia/Tbilisi': 'Georgia',
  'Asia/Tehran': 'Iran',
  'Asia/Thimphu': 'Bhutan',
  'Asia/Tokyo': 'Japan',
  'Asia/Tomsk': 'Russia',
  'Asia/Ulaanbaatar': 'Mongolia',
  'Asia/Urumqi': 'China',
  'Asia/Ust-Nera': 'Russia',
  'Asia/Vientiane': 'Laos',
  'Asia/Vladivostok': 'Russia',
  'Asia/Yakutsk': 'Russia',
  'Asia/Yekaterinburg': 'Russia',
  'Asia/Yerevan': 'Armenia',
  'Atlantic/Azores': 'Portugal',
  'Atlantic/Bermuda': 'Bermuda',
  'Atlantic/Canary': 'Spain',
  'Atlantic/Cape_Verde': 'Cape Verde',
  'Atlantic/Faeroe': 'Faroe Islands',
  'Atlantic/Madeira': 'Portugal',
  'Atlantic/Reykjavik': 'Iceland',
  'Atlantic/South_Georgia': 'South Georgia & South Sandwich Islands',
  'Atlantic/St_Helena': 'St. Helena',
  'Atlantic/Stanley': 'Falkland Islands',
  'Australia/Adelaide': 'Australia',
  'Australia/Brisbane': 'Australia',
  'Australia/Broken_Hill': 'Australia',
  'Australia/Darwin': 'Australia',
  'Australia/Eucla': 'Australia',
  'Australia/Hobart': 'Australia',
  'Australia/Lindeman': 'Australia',
  'Australia/Lord_Howe': 'Australia',
  'Australia/Melbourne': 'Australia',
  'Australia/Perth': 'Australia',
  'Australia/Sydney': 'Australia',
  'Europe/Amsterdam': 'Netherlands',
  'Europe/Andorra': 'Andorra',
  'Europe/Astrakhan': 'Russia',
  'Europe/Athens': 'Greece',
  'Europe/Belgrade': 'Serbia',
  'Europe/Berlin': 'Germany',
  'Europe/Bratislava': 'Slovakia',
  'Europe/Brussels': 'Belgium',
  'Europe/Bucharest': 'Romania',
  'Europe/Budapest': 'Hungary',
  'Europe/Busingen': 'Germany',
  'Europe/Chisinau': 'Moldova',
  'Europe/Copenhagen': 'Denmark',
  'Europe/Dublin': 'Ireland',
  'Europe/Gibraltar': 'Gibraltar',
  'Europe/Guernsey': 'Guernsey',
  'Europe/Helsinki': 'Finland',
  'Europe/Isle_of_Man': 'Isle of Man',
  'Europe/Istanbul': 'Türkiye',
  'Europe/Jersey': 'Jersey',
  'Europe/Kaliningrad': 'Russia',
  'Europe/Kiev': 'Ukraine',
  'Europe/Kirov': 'Russia',
  'Europe/Lisbon': 'Portugal',
  'Europe/Ljubljana': 'Slovenia',
  'Europe/London': 'United Kingdom',
  'Europe/Luxembourg': 'Luxembourg',
  'Europe/Madrid': 'Spain',
  'Europe/Malta': 'Malta',
  'Europe/Mariehamn': 'Åland Islands',
  'Europe/Minsk': 'Belarus',
  'Europe/Monaco': 'Monaco',
  'Europe/Moscow': 'Russia',
  'Europe/Oslo': 'Norway',
  'Europe/Paris': 'France',
  'Europe/Podgorica': 'Montenegro',
  'Europe/Prague': 'Czechia',
  'Europe/Riga': 'Latvia',
  'Europe/Rome': 'Italy',
  'Europe/Samara': 'Russia',
  'Europe/San_Marino': 'San Marino',
  'Europe/Sarajevo': 'Bosnia & Herzegovina',
  'Europe/Saratov': 'Russia',
  'Europe/Simferopol': 'Ukraine',
  'Europe/Skopje': 'North Macedonia',
  'Europe/Sofia': 'Bulgaria',
  'Europe/Stockholm': 'Sweden',
  'Europe/Tallinn': 'Estonia',
  'Europe/Tirane': 'Albania',
  'Europe/Ulyanovsk': 'Russia',
  'Europe/Vaduz': 'Liechtenstein',
  'Europe/Vatican': 'Vatican City',
  'Europe/Vienna': 'Austria',
  'Europe/Vilnius': 'Lithuania',
  'Europe/Volgograd': 'Russia',
  'Europe/Warsaw': 'Poland',
  'Europe/Zagreb': 'Croatia',
  'Europe/Zurich': 'Switzerland',
  'Indian/Antananarivo': 'Madagascar',
  'Indian/Chagos': 'British Indian Ocean Territory',
  'Indian/Christmas': 'Christmas Island',
  'Indian/Cocos': 'Cocos (Keeling) Islands',
  'Indian/Comoro': 'Comoros',
  'Indian/Kerguelen': 'French Southern Territories',
  'Indian/Mahe': 'Seychelles',
  'Indian/Maldives': 'Maldives',
  'Indian/Mauritius': 'Mauritius',
  'Indian/Mayotte': 'Mayotte',
  'Indian/Reunion': 'Réunion',
  'Pacific/Apia': 'Samoa',
  'Pacific/Auckland': 'New Zealand',
  'Pacific/Bougainville': 'Papua New Guinea',
  'Pacific/Chatham': 'New Zealand',
  'Pacific/Easter': 'Chile',
  'Pacific/Efate': 'Vanuatu',
  'Pacific/Enderbury': 'Kiribati',
  'Pacific/Fakaofo': 'Tokelau',
  'Pacific/Fiji': 'Fiji',
  'Pacific/Funafuti': 'Tuvalu',
  'Pacific/Galapagos': 'Ecuador',
  'Pacific/Gambier': 'French Polynesia',
  'Pacific/Guadalcanal': 'Solomon Islands',
  'Pacific/Guam': 'Guam',
  'Pacific/Honolulu': 'United States',
  'Pacific/Kiritimati': 'Kiribati',
  'Pacific/Kosrae': 'Micronesia',
  'Pacific/Kwajalein': 'Marshall Islands',
  'Pacific/Majuro': 'Marshall Islands',
  'Pacific/Marquesas': 'French Polynesia',
  'Pacific/Midway': 'U.S. Outlying Islands',
  'Pacific/Nauru': 'Nauru',
  'Pacific/Niue': 'Niue',
  'Pacific/Norfolk': 'Norfolk Island',
  'Pacific/Noumea': 'New Caledonia',
  'Pacific/Pago_Pago': 'American Samoa',
  'Pacific/Palau': 'Palau',
  'Pacific/Pitcairn': 'Pitcairn Islands',
  'Pacific/Ponape': 'Micronesia',
  'Pacific/Port_Moresby': 'Papua New Guinea',
  'Pacific/Rarotonga': 'Cook Islands',
  'Pacific/Saipan': 'Northern Mariana Islands',
  'Pacific/Tahiti': 'French Polynesia',
  'Pacific/Tarawa': 'Kiribati',
  'Pacific/Tongatapu': 'Tonga',
  'Pacific/Truk': 'Micronesia',
  'Pacific/Wake': 'U.S. Outlying Islands',
  'Pacific/Wallis': 'Wallis & Futuna',
  // Supplementary (see SUPPLEMENTARY_ZONES above) - not part of the generated 418.
  'Etc/GMT+12': 'U.S. Outlying Islands',
};

type HourBand = 'night' | 'edge' | 'working' | 'weekend';

interface StoredZonesState {
  zones: string[];
  customOrder: string[] | null;
}

/** Reads the pinned zones + any manual drag order back from localStorage. Never throws. */
function loadStoredZones(): StoredZonesState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    const zones = parsed?.zones;
    if (!Array.isArray(zones) || zones.length === 0 || !zones.every((z: unknown) => typeof z === 'string')) {
      return null;
    }
    const customOrder = Array.isArray(parsed?.customOrder) ? parsed.customOrder : null;
    return { zones, customOrder };
  } catch {
    return null;
  }
}

/** Persists the pinned zones + any manual drag order. Storage failures (e.g. private
 *  browsing quota) are non-critical, so they're swallowed rather than surfaced. */
function saveStoredZones(state: StoredZonesState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore - persistence is a nice-to-have, not required for the page to function.
  }
}

interface ClockRow {
  zone: string;
  title: string;
  time: string;
  subtitle: string;
  differentDay: boolean;
  weekday: string;
  band: HourBand;
  periodIcon: string;
  periodLabel: string;
  isReference: boolean;
  shade: string;
}

function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function roundToNearest15(totalMinutes: number): number {
  return Math.min(1425, Math.round(totalMinutes / 15) * 15);
}

function formatMinutes(totalMinutes: number): string {
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/** Wall-clock parts of `instant` as rendered in `timeZone`, zero-padded. */
function partsInZone(instant: Date, timeZone: string): Record<string, string> {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'short',
  });
  const parts: Record<string, string> = {};
  for (const part of formatter.formatToParts(instant)) {
    if (part.type !== 'literal') {
      parts[part.type] = part.value;
    }
  }
  return parts;
}

/** `timeZone`'s UTC offset (minutes) at the instant `utcMillis`, positive east of UTC. */
function offsetMinutesAt(utcMillis: number, timeZone: string): number {
  const parts = partsInZone(new Date(utcMillis), timeZone);
  const asUtc = Date.UTC(
    Number(parts['year']),
    Number(parts['month']) - 1,
    Number(parts['day']),
    Number(parts['hour']),
    Number(parts['minute']),
    Number(parts['second']),
  );
  return (asUtc - utcMillis) / 60_000;
}

/**
 * The UTC instant for the given wall-clock date/time as it would read in `timeZone`.
 * Resolves the zone's actual UTC offset for that moment (DST-aware) via two passes —
 * `Intl`/`Date` have no built-in "construct from zoned wall-clock time" API.
 */
function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  let utcMillis = Date.UTC(year, month - 1, day, hour, minute);
  for (let i = 0; i < 2; i++) {
    const offset = offsetMinutesAt(utcMillis, timeZone);
    utcMillis = Date.UTC(year, month - 1, day, hour, minute) - offset * 60_000;
  }
  return new Date(utcMillis);
}

/** Matches timeanddate.com's Meeting Planner "traffic light" convention: weekends count as
 *  non-working regardless of hour. Kept as its own band (not folded into "night") so a
 *  weekend row is visually distinct from a weekday off-hours row, not just "also red". */
function classifyMoment(hour: number, weekday: string): HourBand {
  if (weekday === 'Sat' || weekday === 'Sun') {
    return 'weekend';
  }
  if (hour >= 9 && hour < 18) {
    return 'working';
  }
  if ((hour >= 7 && hour < 9) || (hour >= 18 && hour < 22)) {
    return 'edge';
  }
  return 'night';
}

/** `GMT+5:30` / `GMT-4:00` / `GMT+0:00` style label for an offset already in minutes. */
function formatOffsetMinutes(totalMinutes: number): string {
  const sign = totalMinutes < 0 ? '-' : '+';
  const abs = Math.abs(totalMinutes);
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  return `GMT${sign}${hours}:${String(minutes).padStart(2, '0')}`;
}

/**
 * `timeZone`'s standard (non-DST) UTC offset, in minutes — DST always shifts a clock forward
 * relative to standard time, so sampling two dates 6 months apart and keeping the smaller
 * value reliably gives the non-DST baseline regardless of hemisphere. Used for the zone
 * *search* list specifically: sorting/labeling it by the live current offset made it look
 * inconsistent, since whichever zones currently happen to be in DST would jump out of their
 * expected position relative to zones at the "same" nominal offset that aren't observing DST
 * right now. The standard offset is stable all year, like a classic timezone-picker list.
 */
function standardOffsetMinutes(zone: string): number {
  const year = new Date().getFullYear();
  const jan = offsetMinutesAt(Date.UTC(year, 0, 15, 12), zone);
  const jul = offsetMinutesAt(Date.UTC(year, 6, 15, 12), zone);
  return Math.min(jan, jul);
}

/** The human-readable city/location part of an IANA zone id: last path segment, underscores
 *  back to spaces (e.g. "America/Argentina/Buenos_Aires" -> "Buenos Aires") — except for the
 *  handful of `SUPPLEMENTARY_ZONES`, whose raw id ("Etc/GMT+12") isn't a place name at all. */
function cityNameFor(zone: string): string {
  if (zone in SUPPLEMENTARY_ZONE_NAMES) {
    return SUPPLEMENTARY_ZONE_NAMES[zone];
  }
  const lastSegment = zone.split('/').pop() ?? zone;
  return lastSegment.replace(/_/g, ' ');
}

/** "GMT-4:00 New York, United States" — offset-prefixed city (and country, where
 *  `ZONE_COUNTRY_NAMES` has one — only "UTC" doesn't) name, used for both the zone search list
 *  and the reference-zone picker so a user can search/scan by place rather than raw zone id. */
function formatZoneOption(offsetMinutes: number, zone: string): string {
  const countryName = ZONE_COUNTRY_NAMES[zone];
  const place = countryName ? `${cityNameFor(zone)}, ${countryName}` : cityNameFor(zone);
  return `${formatOffsetMinutes(offsetMinutes)} ${place}`;
}

function dayPeriod(hour: number): { periodIcon: string; periodLabel: string } {
  if (hour >= 5 && hour < 12) {
    return { periodIcon: '🌅', periodLabel: 'Morning' };
  }
  if (hour >= 12 && hour < 17) {
    return { periodIcon: '☀️', periodLabel: 'Noon' };
  }
  if (hour >= 17 && hour < 21) {
    return { periodIcon: '🌇', periodLabel: 'Evening' };
  }
  return { periodIcon: '🌙', periodLabel: 'Night' };
}

/** Flat (non-gradient) background shade for a row, smoothly interpolated from its own local
 *  time-of-day — so it glides through the cycle as the slider moves rather than jumping
 *  between a handful of fixed bands. Every stop is a similarly light pastel so the row's
 *  normal dark text stays clearly readable against any shade in the cycle. */
const DAY_SHADE_STOPS: { minutes: number; rgb: readonly [number, number, number] }[] = [
  { minutes: 0, rgb: [203, 211, 235] }, // midnight - soft lavender-blue
  { minutes: 360, rgb: [255, 219, 196] }, // 06:00 dawn - soft peach
  { minutes: 720, rgb: [217, 241, 255] }, // 12:00 noon - soft sky blue
  { minutes: 1080, rgb: [255, 213, 226] }, // 18:00 dusk - soft pink
  { minutes: 1440, rgb: [203, 211, 235] }, // wraps back to midnight
];

function shadeForMinutes(totalMinutes: number): string {
  const m = ((totalMinutes % 1440) + 1440) % 1440;
  let lower = DAY_SHADE_STOPS[0];
  let upper = DAY_SHADE_STOPS[DAY_SHADE_STOPS.length - 1];
  for (let i = 0; i < DAY_SHADE_STOPS.length - 1; i++) {
    if (m >= DAY_SHADE_STOPS[i].minutes && m <= DAY_SHADE_STOPS[i + 1].minutes) {
      lower = DAY_SHADE_STOPS[i];
      upper = DAY_SHADE_STOPS[i + 1];
      break;
    }
  }
  const span = upper.minutes - lower.minutes;
  const t = span === 0 ? 0 : (m - lower.minutes) / span;
  const [r, g, b] = lower.rgb.map((channel, i) => Math.round(channel + (upper.rgb[i] - channel) * t));
  return `rgb(${r}, ${g}, ${b})`;
}

@Component({
  imports: [Button, PageHeader, FormsModule],
  selector: 'sap-world-clock',
  styleUrl: './world-clock.scss',
  templateUrl: './world-clock.html',
})
export class WorldClock {
  private readonly localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  readonly availableZones = Intl.supportedValuesOf('timeZone');

  /** `{zone, label}` ("GMT-4:00 New York, United States") for every zone plus
   *  `SUPPLEMENTARY_ZONES`, sorted west-to-east by *standard* offset, for the search datalist.
   *  Standard rather than live offset so the list's order and grouping stay fixed all year
   *  instead of jittering with whichever zones currently happen to be in DST; the live rows
   *  below still use the actual displayed moment's offset, which is what matters there. */
  readonly zoneSearchOptions = [...this.availableZones, ...SUPPLEMENTARY_ZONES]
    .map((zone) => {
      const offsetMinutes = standardOffsetMinutes(zone);
      return { zone, offsetMinutes, label: formatZoneOption(offsetMinutes, zone) };
    })
    .sort((a, b) => a.offsetMinutes - b.offsetMinutes);
  private readonly stored = loadStoredZones();

  readonly zones = signal<string[]>(
    this.stored?.zones ?? Array.from(new Set([this.localZone, ...DEFAULT_ZONES])),
  );
  readonly zoneToAdd = signal('');

  // Manual row order from dragging; null means "not customized yet, auto-sort by offset".
  private readonly customOrder = signal<string[] | null>(this.stored?.customOrder ?? null);
  readonly dragOverZone = signal<string | null>(null);
  private dragZone: string | null = null;

  // Pick a date + time-of-day in a reference zone; "Reset to now" snaps it back to the current moment.
  readonly planDate = signal(todayIsoDate());
  readonly planMinutes = signal(
    roundToNearest15(new Date().getHours() * 60 + new Date().getMinutes()),
  );
  private readonly referenceZoneId = signal(this.localZone);
  readonly hourTicks = Array.from({ length: 24 }, (_, hour) => hour * 60);

  readonly referenceZone = computed(() => {
    const zones = this.zones();
    return zones.includes(this.referenceZoneId()) ? this.referenceZoneId() : zones[0];
  });

  /** Same "GMT-4:00 New York, United States" format as the search list, sorted the same
   *  west-to-east way, for the pinned zones only — reflects the offset at the currently
   *  displayed moment, not just "now". */
  readonly referenceZoneOptions = computed(() => {
    const instantMs = this.instant().getTime();
    return this.zones()
      .map((zone) => {
        const offsetMinutes = Math.round(offsetMinutesAt(instantMs, zone));
        return { zone, offsetMinutes, label: formatZoneOption(offsetMinutes, zone) };
      })
      .sort((a, b) => a.offsetMinutes - b.offsetMinutes);
  });

  readonly planTimeLabel = computed(() => formatMinutes(this.planMinutes()));

  private readonly instant = computed(() => {
    const [year, month, day] = this.planDate().split('-').map(Number);
    const hour = Math.floor(this.planMinutes() / 60);
    const minute = this.planMinutes() % 60;
    return zonedTimeToUtc(year, month, day, hour, minute, this.referenceZone());
  });

  /** Zones ordered west-to-east by UTC offset at the currently displayed moment. */
  private readonly autoSortedZones = computed(() => {
    const instantMs = this.instant().getTime();
    return [...this.zones()].sort(
      (a, b) => offsetMinutesAt(instantMs, a) - offsetMinutesAt(instantMs, b),
    );
  });

  /** Auto-sorted, unless the user has dragged rows into a custom order. New/removed zones
   *  reconcile against whichever order is active: appended at the end, or dropped. */
  readonly orderedZones = computed(() => {
    const custom = this.customOrder();
    if (!custom) {
      return this.autoSortedZones();
    }
    const zoneSet = new Set(this.zones());
    const kept = custom.filter((zone) => zoneSet.has(zone));
    const missing = this.zones().filter((zone) => !kept.includes(zone));
    return [...kept, ...missing];
  });

  /** Position (as a % of the track) of the current moment in the reference zone — only when
   *  the picked date is actually today there; otherwise "now" has no spot on this day's slider. */
  readonly nowMarker = computed<{ percent: number } | null>(() => {
    const nowParts = partsInZone(new Date(), this.referenceZone());
    const todayInRefZone = `${nowParts['year']}-${nowParts['month']}-${nowParts['day']}`;
    if (todayInRefZone !== this.planDate()) {
      return null;
    }
    const nowMinutes = Number(nowParts['hour']) * 60 + Number(nowParts['minute']);
    return { percent: Math.min(100, (nowMinutes / 1425) * 100) };
  });

  /** One row per pinned zone, mapped onto whatever moment the planner controls select. */
  readonly displayRows = computed<ClockRow[]>(() => {
    const instant = this.instant();
    const referenceZone = this.referenceZone();
    const [year, month, day] = this.planDate().split('-').map(Number);
    const refDateUtc = Date.UTC(year, month - 1, day);

    return this.orderedZones().map((zone) => {
      const parts = partsInZone(instant, zone);
      const zoneHour = Number(parts['hour']);
      const zoneMinute = Number(parts['minute']);
      const zoneDateUtc = Date.UTC(Number(parts['year']), Number(parts['month']) - 1, Number(parts['day']));
      const dayDiff = Math.round((zoneDateUtc - refDateUtc) / 86_400_000);
      const offsetMinutes = Math.round(offsetMinutesAt(instant.getTime(), zone));

      return {
        zone,
        // Same "GMT±H:MM City, Country" format as the search/reference lists, so a row's
        // title alone identifies the zone — the GMT value no longer needs repeating below.
        title: formatZoneOption(offsetMinutes, zone),
        time: `${parts['hour']}:${parts['minute']}`,
        subtitle: this.dayLabel(dayDiff),
        differentDay: dayDiff !== 0,
        weekday: parts['weekday'],
        band: classifyMoment(zoneHour, parts['weekday']),
        isReference: zone === referenceZone,
        shade: shadeForMinutes(zoneHour * 60 + zoneMinute),
        ...dayPeriod(zoneHour),
      };
    });
  });

  constructor() {
    effect(() => {
      saveStoredZones({ zones: this.zones(), customOrder: this.customOrder() });
    });
  }

  addZone(): void {
    // The datalist's option value is the display label ("GMT-4:00 New York, United States"),
    // not the raw zone id — so the native datalist fills the input with that same label the
    // user saw and picked, instead of silently swapping it for the id. Resolve it back to a
    // zone id here; falling back to the typed text itself still lets a raw id be entered directly.
    const typed = this.zoneToAdd().trim();
    const match = this.zoneSearchOptions.find((option) => option.label === typed);
    const zone = match?.zone ?? typed;
    const isValidZone = this.availableZones.includes(zone) || SUPPLEMENTARY_ZONES.includes(zone);
    if (isValidZone && !this.zones().includes(zone)) {
      this.zones.update((zones) => [...zones, zone]);
      this.zoneToAdd.set('');
    }
  }

  removeZone(zone: string): void {
    this.zones.update((zones) => zones.filter((z) => z !== zone));
  }

  resetPlanToNow(): void {
    // Only the date + slider position snap back to "now" — the reference zone is left alone,
    // so it has to be the one this "now" is read in (not the browser's local zone), otherwise
    // re-interpreting today's local wall-clock numbers through a different zone would land on
    // the wrong instant entirely. Leaving the reference zone untouched also means row order and
    // which row is flagged `isReference` don't change, since neither depends on it anyway.
    const parts = partsInZone(new Date(), this.referenceZone());
    this.planDate.set(`${parts['year']}-${parts['month']}-${parts['day']}`);
    this.planMinutes.set(roundToNearest15(Number(parts['hour']) * 60 + Number(parts['minute'])));
  }

  setReferenceZone(zone: string): void {
    this.referenceZoneId.set(zone);
  }

  /** Clicking a row's time makes that zone the reference — same moment stays displayed
   *  everywhere, just re-expressed in that zone's own wall-clock time, mirroring
   *  timeanddate.com's "click any listed city's time" interaction. */
  selectRowAsReference(zone: string): void {
    const parts = partsInZone(this.instant(), zone);
    this.planDate.set(`${parts['year']}-${parts['month']}-${parts['day']}`);
    this.planMinutes.set(Number(parts['hour']) * 60 + Number(parts['minute']));
    this.referenceZoneId.set(zone);
  }

  onDragStart(event: DragEvent, zone: string): void {
    this.dragZone = zone;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', zone);
      const row = (event.currentTarget as HTMLElement).closest('.clock-row') as HTMLElement | null;
      if (row) {
        event.dataTransfer.setDragImage(row, 20, 20);
      }
    }
  }

  onDragOver(event: DragEvent, zone: string): void {
    event.preventDefault();
    if (this.dragZone && this.dragZone !== zone) {
      this.dragOverZone.set(zone);
    }
  }

  onDrop(event: DragEvent, targetZone: string): void {
    event.preventDefault();
    const source = this.dragZone;
    this.dragOverZone.set(null);
    if (!source || source === targetZone) {
      return;
    }
    const current = this.orderedZones();
    const withoutSource = current.filter((zone) => zone !== source);
    const targetIndex = withoutSource.indexOf(targetZone);
    withoutSource.splice(targetIndex, 0, source);
    this.customOrder.set(withoutSource);
    this.dragZone = null;
  }

  onDragEnd(): void {
    this.dragZone = null;
    this.dragOverZone.set(null);
  }

  private dayLabel(dayDiff: number): string {
    if (dayDiff === 0) {
      return 'Same day';
    }
    if (dayDiff === 1) {
      return 'Next day';
    }
    if (dayDiff === -1) {
      return 'Previous day';
    }
    return dayDiff > 0 ? `${dayDiff} days later` : `${Math.abs(dayDiff)} days earlier`;
  }
}
