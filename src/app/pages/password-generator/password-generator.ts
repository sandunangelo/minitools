import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../core/shared/components/button/button';
import { PageHeader } from '../../core/shared/components/page-header/page-header';

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

interface Strength {
  label: string;
  className: 'weak' | 'ok' | 'strong';
}

@Component({
  imports: [Button, FormsModule, PageHeader],
  selector: 'sap-password-generator',
  styleUrl: './password-generator.scss',
  templateUrl: './password-generator.html',
})
export class PasswordGenerator {
  readonly length = signal(16);
  readonly useLowercase = signal(true);
  readonly useUppercase = signal(true);
  readonly useNumbers = signal(true);
  readonly useSymbols = signal(false);

  readonly password = signal('');
  readonly copied = signal(false);

  readonly strength = computed<Strength>(() => {
    const charsetSize =
      (this.useLowercase() ? LOWERCASE.length : 0) +
      (this.useUppercase() ? UPPERCASE.length : 0) +
      (this.useNumbers() ? NUMBERS.length : 0) +
      (this.useSymbols() ? SYMBOLS.length : 0);

    if (charsetSize === 0) {
      return { label: 'Select at least one character set', className: 'weak' };
    }

    const entropy = this.length() * Math.log2(charsetSize);
    if (entropy < 40) {
      return { label: 'Weak', className: 'weak' };
    }
    if (entropy < 70) {
      return { label: 'Reasonable', className: 'ok' };
    }
    return { label: 'Strong', className: 'strong' };
  });

  constructor() {
    this.generate();
  }

  generate(): void {
    const charset = this.buildCharset();
    if (!charset) {
      this.password.set('');
      return;
    }

    const randomValues = crypto.getRandomValues(new Uint32Array(this.length()));
    let password = '';
    for (let i = 0; i < this.length(); i++) {
      password += charset[randomValues[i] % charset.length];
    }
    this.password.set(password);
    this.copied.set(false);
  }

  async copy(): Promise<void> {
    if (!this.password()) {
      return;
    }
    await navigator.clipboard.writeText(this.password());
    this.copied.set(true);
  }

  private buildCharset(): string {
    return (
      (this.useLowercase() ? LOWERCASE : '') +
      (this.useUppercase() ? UPPERCASE : '') +
      (this.useNumbers() ? NUMBERS : '') +
      (this.useSymbols() ? SYMBOLS : '')
    );
  }
}
