import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../core/shared/components/button/button';
import { PageHeader } from '../../core/shared/components/page-header/page-header';

interface BmiCategory {
  label: string;
  className: string;
}

@Component({
  imports: [Button, DecimalPipe, FormsModule, PageHeader],
  selector: 'sap-bmi-calculator',
  styleUrl: './bmi-calculator.scss',
  templateUrl: './bmi-calculator.html',
})
export class BmiCalculator {
  readonly heightCm = signal(170);
  readonly weightKg = signal(70);

  readonly bmi = computed(() => {
    const heightM = this.heightCm() / 100;
    if (heightM <= 0 || this.weightKg() <= 0) {
      return null;
    }
    return this.weightKg() / (heightM * heightM);
  });

  readonly category = computed<BmiCategory | null>(() => {
    const bmi = this.bmi();
    if (bmi === null) {
      return null;
    }
    if (bmi < 18.5) {
      return { label: 'Underweight', className: 'under' };
    }
    if (bmi < 25) {
      return { label: 'Normal weight', className: 'normal' };
    }
    if (bmi < 30) {
      return { label: 'Overweight', className: 'over' };
    }
    return { label: 'Obese', className: 'obese' };
  });

  reset(): void {
    this.heightCm.set(170);
    this.weightKg.set(70);
  }
}
