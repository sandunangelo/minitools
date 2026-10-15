import {
  COLOR_CONVERTER_STORAGE_KEY,
  EXCHANGE_RATES_STORAGE_KEY,
  WORLD_CLOCK_STORAGE_KEY,
} from '../storage-keys';

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  /** localStorage keys this tool saves user selections under, if any — surfaced in the
   *  navbar's "clear saved data" settings panel. Omit for tools that persist nothing. */
  storageKeys?: string[];
}

export const TOOLS: Tool[] = [
  {
    id: 'financial',
    title: 'Financial',
    description: 'Live exchange rates and amount-in-words for cheques and bank slips.',
    icon: '🏦',
    route: '/financial',
    storageKeys: [EXCHANGE_RATES_STORAGE_KEY],
  },
  {
    id: 'world-clock',
    title: 'World Clock',
    description: 'Track the current time across multiple time zones.',
    icon: '🕒',
    route: '/world-clock',
    storageKeys: [WORLD_CLOCK_STORAGE_KEY],
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert length, weight, area, volume, and more.',
    icon: '📐',
    route: '/unit-converter',
  },
  {
    id: 'bmi-calculator',
    title: 'BMI Calculator',
    description: 'Calculate Body Mass Index from height and weight.',
    icon: '⚖️',
    route: '/bmi-calculator',
  },
  {
    id: 'password-generator',
    title: 'Password Generator',
    description: 'Generate strong, random passwords.',
    icon: '🔐',
    route: '/password-generator',
  },
  {
    id: 'color-converter',
    title: 'Color Converter',
    description: 'Convert colors between HEX, RGB, and HSL.',
    icon: '🎨',
    route: '/color-converter',
    storageKeys: [COLOR_CONVERTER_STORAGE_KEY],
  },
  {
    id: 'text-case-converter',
    title: 'Text Case Converter',
    description: 'Convert text to UPPERCASE, Title Case, camelCase, and more.',
    icon: '🔤',
    route: '/text-case-converter',
  },
  {
    id: 'word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, sentences, and estimated reading time.',
    icon: '📝',
    route: '/word-counter',
  },
  {
    id: 'text-converters',
    title: 'Text Converters',
    description: 'Validate and format JSON and XML — error locations, beautify/minify, syntax highlighting.',
    icon: '🔄',
    route: '/text-converters',
  },
  {
    id: 'tip-calculator',
    title: 'Tip Calculator',
    description: 'Work out the tip and split the bill between everyone.',
    icon: '💰',
    route: '/tip-calculator',
  },
  {
    id: 'string-codec',
    title: 'String Encode/Decode',
    description: 'Encode or decode text for URLs, Base64, HTML, JSON strings, and JWT tokens.',
    icon: '🔣',
    route: '/string-codec',
  },
  {
    id: 'loading-indicator',
    title: 'Loading Indicator Generator',
    description: 'Design a pure HTML/CSS loading spinner — pick a style, color, and size.',
    icon: '🌀',
    route: '/loading-indicator',
  },
];
