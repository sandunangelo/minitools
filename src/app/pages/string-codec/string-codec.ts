import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../core/shared/components/button/button';
import { PageHeader } from '../../core/shared/components/page-header/page-header';

type SimpleMode = 'url' | 'base64' | 'html' | 'json';
type Mode = SimpleMode | 'jwt';
type Direction = 'encode' | 'decode';

interface ModeOption {
  id: Mode;
  label: string;
  icon: string;
}

const MODES: ModeOption[] = [
  { id: 'url', label: 'URL', icon: '🔗' },
  { id: 'base64', label: 'Base64', icon: '🔢' },
  { id: 'html', label: 'HTML', icon: '🏷️' },
  { id: 'json', label: 'JSON String', icon: '🧾' },
  { id: 'jwt', label: 'JWT', icon: '🪪' },
];

// ---------------------------------------------------------------------------------------------
// URL / Base64 / HTML / JSON-string: all four share the exact same shape (one input, one
// output, an Encode/Decode direction), so they're driven by one generic lookup table rather than
// four near-identical components — see `codecResult` on the component below.
// ---------------------------------------------------------------------------------------------

function urlEncode(text: string): string {
  return encodeURIComponent(text);
}

function urlDecode(text: string): string {
  return decodeURIComponent(text); // throws URIError on a malformed escape sequence
}

// btoa/atob only operate on Latin1 ("binary string") text — anything outside that range (emoji,
// most non-English scripts) throws directly from btoa, so the string is first run through its
// UTF-8 byte representation and back, the standard browser-side workaround for UTF-8-safe base64
// (this exact pattern is MDN's own documented recipe for it).
function base64Encode(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function base64Decode(text: string): string {
  const binary = atob(text); // throws DOMException on invalid base64
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  // fatal: true surfaces a clear error for garbage input instead of silently replacing invalid
  // byte sequences with U+FFFD replacement characters.
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

function htmlEncode(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// The browser's own HTML parser is a far more complete and correct entity decoder (named,
// decimal, AND hex numeric references) than any hand-rolled named-entity table would be —
// setting innerHTML and reading .value back off a detached <textarea> decodes entities without
// ever executing anything, since a textarea's content is always parsed as plain text, never markup.
function htmlDecode(text: string): string {
  const el = document.createElement('textarea');
  el.innerHTML = text;
  return el.value;
}

function jsonEncode(text: string): string {
  return JSON.stringify(text);
}

function jsonDecode(text: string): string {
  const trimmed = text.trim();
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed === 'string') {
      return parsed;
    }
  } catch {
    // falls through to the forgiving retry below
  }
  // Forgiving fallback for content pasted without its surrounding quotes (e.g. just
  // `hello\nworld` rather than `"hello\nworld"`) — if this also fails, its SyntaxError is what
  // the caller sees, which is more useful here than the first (quoted) attempt's would be.
  return JSON.parse(`"${trimmed}"`);
}

const CODECS: Record<SimpleMode, { encode: (text: string) => string; decode: (text: string) => string }> = {
  url: { encode: urlEncode, decode: urlDecode },
  base64: { encode: base64Encode, decode: base64Decode },
  html: { encode: htmlEncode, decode: htmlDecode },
  json: { encode: jsonEncode, decode: jsonDecode },
};

const SAMPLES: Record<SimpleMode, string> = {
  url: 'https://example.com/search?q=hello world&lang=en',
  base64: 'Hello, Minitools! 🎉',
  html: '<p class="greeting">Tom & Jerry say "hi"</p>',
  json: 'Line one\nLine two with a "quote" and a \\backslash',
};

/** V8/DOM errors (SyntaxError, URIError, DOMException) all carry a `.message`, but duck-typed
 *  here rather than via `instanceof Error` — not every engine's DOMException is guaranteed to be
 *  in Error's prototype chain, and checking for the property directly sidesteps the question. */
function describeError(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
    return (err as { message: string }).message;
  }
  return 'Could not process that input.';
}

// ---------------------------------------------------------------------------------------------
// JWT: structurally different from the four above (3 dot-separated base64url segments, each
// itself JSON, plus an optional HMAC signature), so it gets its own decode/encode logic and UI
// section instead of fitting the generic single-input/single-output shape.
// ---------------------------------------------------------------------------------------------

function base64UrlDecodeToBytes(segment: string): Uint8Array {
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function base64UrlEncodeFromBytes(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function utf8Decode(bytes: Uint8Array): string {
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

// Explicit Uint8Array<ArrayBuffer> (not the bare, wider `Uint8Array`) — crypto.subtle's newer
// TS overloads only accept a BufferSource backed by a definite ArrayBuffer, not the broader
// ArrayBufferLike (which also admits SharedArrayBuffer) that a plain return-type annotation
// here would otherwise widen to.
function utf8Encode(text: string): Uint8Array<ArrayBuffer> {
  return new TextEncoder().encode(text);
}

async function hmacSha256(message: string, secret: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    utf8Encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, utf8Encode(message));
  return new Uint8Array(signature);
}

interface JwtDecoded {
  headerJson: string;
  payloadJson: string;
  alg: string | undefined;
  signatureSegment: string;
  claims: { exp?: string; iat?: string; nbf?: string };
}

interface JwtResult {
  decoded: JwtDecoded | null;
  error: string | null;
}

const TIMESTAMP_CLAIMS = ['exp', 'iat', 'nbf'] as const;

function decodeJwt(token: string): JwtDecoded {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    throw new Error('A JWT must have 3 dot-separated parts: header.payload.signature.');
  }
  const [headerB64, payloadB64, signatureSegment] = parts;
  const headerObj = JSON.parse(utf8Decode(base64UrlDecodeToBytes(headerB64)));
  const payloadObj = JSON.parse(utf8Decode(base64UrlDecodeToBytes(payloadB64)));

  const claims: JwtDecoded['claims'] = {};
  for (const claim of TIMESTAMP_CLAIMS) {
    const value = payloadObj[claim];
    if (typeof value === 'number') {
      claims[claim] = new Date(value * 1000).toLocaleString();
    }
  }

  return {
    headerJson: JSON.stringify(headerObj, null, 2),
    payloadJson: JSON.stringify(payloadObj, null, 2),
    alg: typeof headerObj.alg === 'string' ? headerObj.alg : undefined,
    signatureSegment,
    claims,
  };
}

type SignatureStatus = 'none' | 'checking' | 'valid' | 'invalid' | 'unsupported-alg';

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

@Component({
  imports: [Button, FormsModule, PageHeader],
  selector: 'sap-string-codec',
  styleUrl: './string-codec.scss',
  templateUrl: './string-codec.html',
})
export class StringCodec {
  readonly modes = MODES;

  readonly mode = signal<Mode>('url');
  readonly direction = signal<Direction>('encode');
  readonly codecInput = signal('');
  readonly codecCopied = signal(false);

  readonly codecResult = computed<{ value: string; error: string | null }>(() => {
    const raw = this.codecInput();
    const mode = this.mode();
    if (!raw || mode === 'jwt') {
      return { value: '', error: null };
    }
    const codec = CODECS[mode];
    try {
      const value = this.direction() === 'encode' ? codec.encode(raw) : codec.decode(raw);
      return { value, error: null };
    } catch (err) {
      return { value: '', error: describeError(err) };
    }
  });

  readonly jwtToken = signal('');
  readonly jwtSecret = signal('');
  readonly jwtSignatureStatus = signal<SignatureStatus>('none');

  readonly jwtResult = computed<JwtResult | null>(() => {
    const raw = this.jwtToken().trim();
    if (!raw) {
      return null;
    }
    try {
      return { decoded: decodeJwt(raw), error: null };
    } catch (err) {
      return { decoded: null, error: describeError(err) };
    }
  });

  readonly jwtHeaderInput = signal('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  readonly jwtPayloadInput = signal('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  readonly jwtEncodeSecret = signal('your-256-bit-secret');
  readonly jwtEncodedToken = signal('');
  readonly jwtEncodeError = signal<string | null>(null);
  readonly jwtEncodeCopied = signal(false);

  readonly copiedHeader = signal(false);
  readonly copiedPayload = signal(false);

  constructor() {
    effect(() => {
      const result = this.jwtResult();
      const secret = this.jwtSecret();
      void this.checkSignature(result, secret);
    });
  }

  /** Only HS256 (the one symmetric, secret-based algorithm) can be verified client-side with
   *  nothing but a pasted secret — RS256/ES256 etc. need a public key, not a shared secret, so
   *  those are reported as unsupported rather than silently claiming "invalid". */
  private async checkSignature(result: JwtResult | null, secret: string): Promise<void> {
    if (!result || !result.decoded || !secret.trim()) {
      this.jwtSignatureStatus.set('none');
      return;
    }
    if (result.decoded.alg !== 'HS256') {
      this.jwtSignatureStatus.set('unsupported-alg');
      return;
    }
    this.jwtSignatureStatus.set('checking');
    const token = this.jwtToken().trim();
    const [headerB64, payloadB64] = token.split('.');
    const computed = await hmacSha256(`${headerB64}.${payloadB64}`, secret);
    const computedB64Url = base64UrlEncodeFromBytes(computed);
    // Guard against a stale response landing after the token/secret changed again mid-flight.
    if (this.jwtToken().trim() === token && this.jwtSecret() === secret) {
      this.jwtSignatureStatus.set(computedB64Url === result.decoded.signatureSegment ? 'valid' : 'invalid');
    }
  }

  setMode(mode: Mode): void {
    this.mode.set(mode);
    this.codecCopied.set(false);
  }

  setDirection(direction: Direction): void {
    this.direction.set(direction);
    this.codecCopied.set(false);
  }

  /** Moves the current output into the input box and flips direction — the quick way to check
   *  that what you just encoded decodes back to the original (or vice versa). */
  swapCodecInputOutput(): void {
    const value = this.codecResult().value;
    if (!value) {
      return;
    }
    this.codecInput.set(value);
    this.direction.set(this.direction() === 'encode' ? 'decode' : 'encode');
    this.codecCopied.set(false);
  }

  loadCodecSample(): void {
    const mode = this.mode();
    if (mode === 'jwt') {
      return;
    }
    this.codecInput.set(SAMPLES[mode]);
    this.direction.set('encode');
    this.codecCopied.set(false);
  }

  clearCodecInput(): void {
    this.codecInput.set('');
    this.codecCopied.set(false);
  }

  async copyCodecOutput(): Promise<void> {
    const value = this.codecResult().value;
    if (!value) {
      return;
    }
    await navigator.clipboard.writeText(value);
    this.codecCopied.set(true);
  }

  loadJwtSample(): void {
    this.jwtToken.set(SAMPLE_JWT);
    this.jwtSecret.set('');
  }

  async copyHeader(): Promise<void> {
    const decoded = this.jwtResult()?.decoded;
    if (!decoded) {
      return;
    }
    await navigator.clipboard.writeText(decoded.headerJson);
    this.copiedHeader.set(true);
  }

  async copyPayload(): Promise<void> {
    const decoded = this.jwtResult()?.decoded;
    if (!decoded) {
      return;
    }
    await navigator.clipboard.writeText(decoded.payloadJson);
    this.copiedPayload.set(true);
  }

  async encodeJwt(): Promise<void> {
    this.jwtEncodeCopied.set(false);
    try {
      const headerObj = JSON.parse(this.jwtHeaderInput());
      const payloadObj = JSON.parse(this.jwtPayloadInput());
      const headerB64 = base64UrlEncodeFromBytes(utf8Encode(JSON.stringify(headerObj)));
      const payloadB64 = base64UrlEncodeFromBytes(utf8Encode(JSON.stringify(payloadObj)));
      const signingInput = `${headerB64}.${payloadB64}`;

      let signatureB64 = '';
      const alg = headerObj.alg;
      const secret = this.jwtEncodeSecret().trim();
      if (alg === 'HS256' && secret) {
        const signature = await hmacSha256(signingInput, secret);
        signatureB64 = base64UrlEncodeFromBytes(signature);
      } else if (alg && alg !== 'none' && alg !== 'HS256') {
        throw new Error(
          `"${alg}" signing isn't supported here — only HS256 (with a secret) or "none" are. ` +
            'Change "alg" in the header, or provide a secret for HS256.',
        );
      }

      this.jwtEncodedToken.set(`${signingInput}.${signatureB64}`);
      this.jwtEncodeError.set(null);
    } catch (err) {
      this.jwtEncodedToken.set('');
      this.jwtEncodeError.set(describeError(err));
    }
  }

  async copyEncodedJwt(): Promise<void> {
    const token = this.jwtEncodedToken();
    if (!token) {
      return;
    }
    await navigator.clipboard.writeText(token);
    this.jwtEncodeCopied.set(true);
  }
}
