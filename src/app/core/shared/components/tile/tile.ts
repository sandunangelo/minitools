import { Component, input } from '@angular/core';
import type { Tool } from '../../models/tool';

@Component({
  selector: 'sap-tile',
  styleUrl: './tile.scss',
  templateUrl: './tile.html',
})
export class Tile {
  readonly tool = input.required<Tool>();
}
