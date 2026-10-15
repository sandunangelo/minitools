import { Component, input } from '@angular/core';

@Component({
  selector: 'sap-page-header',
  styleUrl: './page-header.scss',
  templateUrl: './page-header.html',
})
export class PageHeader {
  readonly icon = input('');
  readonly title = input.required<string>();
  readonly description = input('');
}
