import { Component, input, output } from '@angular/core';

export type ButtonFillMode = 'solid' | 'outline' | 'flat';
export type ButtonThemeColor = 'primary' | 'base' | 'error';

@Component({
  selector: 'sap-button',
  styleUrl: './button.scss',
  templateUrl: './button.html',
})
export class Button {
  readonly type = input<'button' | 'submit'>('button');
  readonly themeColor = input<ButtonThemeColor>('primary');
  readonly fillMode = input<ButtonFillMode>('solid');
  readonly disabled = input(false);
  /** For icon-only buttons: forwarded to the native button's aria-label and title
   *  (sap-button's host has no box of its own, so a plain `title`/`aria-label`
   *  attribute set on <sap-button> wouldn't reliably reach the rendered button). */
  readonly ariaLabel = input<string | null>(null);
  readonly clicked = output<void>();
}
