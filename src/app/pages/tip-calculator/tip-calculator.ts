import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../core/shared/components/button/button';
import { PageHeader } from '../../core/shared/components/page-header/page-header';

const QUICK_TIP_PERCENTS = [10, 15, 18, 20, 25];

@Component({
  imports: [Button, DecimalPipe, FormsModule, PageHeader],
  selector: 'sap-tip-calculator',
  styleUrl: './tip-calculator.scss',
  templateUrl: './tip-calculator.html',
})
export class TipCalculator {
  readonly quickTipPercents = QUICK_TIP_PERCENTS;

  readonly bill = signal(0);
  readonly tipPercent = signal(15);
  readonly people = signal(1);

  readonly tipAmount = computed(() => Math.max(0, this.bill()) * (this.tipPercent() / 100));
  readonly total = computed(() => Math.max(0, this.bill()) + this.tipAmount());
  readonly perPersonTip = computed(() => this.tipAmount() / Math.max(1, this.people()));
  readonly perPersonTotal = computed(() => this.total() / Math.max(1, this.people()));

  reset(): void {
    this.bill.set(0);
    this.tipPercent.set(15);
    this.people.set(1);
  }
}
