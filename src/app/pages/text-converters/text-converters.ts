import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JsonFormatter } from '../json-formatter/json-formatter';
import { XmlFormatter } from '../xml-formatter/xml-formatter';
import { PageHeader } from '../../core/shared/components/page-header/page-header';

type Subtool = 'json-formatter' | 'xml-formatter';

@Component({
  imports: [JsonFormatter, XmlFormatter, PageHeader],
  selector: 'sap-text-converters',
  styleUrl: './text-converters.scss',
  templateUrl: './text-converters.html',
})
export class TextConverters {
  // Lets the Sitemap page's subtool links (?tab=xml-formatter) land directly on that subtool —
  // same reasoning as Financial's identical pattern (see its own comment).
  private readonly route = inject(ActivatedRoute);
  readonly activeSubtool = signal<Subtool>(
    this.route.snapshot.queryParamMap.get('tab') === 'xml-formatter' ? 'xml-formatter' : 'json-formatter',
  );
}
