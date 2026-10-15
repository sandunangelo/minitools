import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../core/shared/components/button/button';
import { PageHeader } from '../../core/shared/components/page-header/page-header';

interface UnitDef {
  id: string;
  label: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

interface Category {
  id: string;
  label: string;
  units: UnitDef[];
}

function linearUnit(id: string, label: string, factor: number): UnitDef {
  return { id, label, toBase: (v) => v * factor, fromBase: (v) => v / factor };
}

const CATEGORIES: Category[] = [
  {
    id: 'length',
    label: 'Length',
    units: [
      linearUnit('mm', 'Millimeters', 0.001),
      linearUnit('cm', 'Centimeters', 0.01),
      linearUnit('m', 'Meters', 1),
      linearUnit('km', 'Kilometers', 1000),
      linearUnit('in', 'Inches', 0.0254),
      linearUnit('ft', 'Feet', 0.3048),
      linearUnit('yd', 'Yards', 0.9144),
      linearUnit('mi', 'Miles', 1609.344),
    ],
  },
  {
    id: 'weight',
    label: 'Weight',
    units: [
      linearUnit('g', 'Grams', 0.001),
      linearUnit('kg', 'Kilograms', 1),
      linearUnit('lb', 'Pounds', 0.45359237),
      linearUnit('oz', 'Ounces', 0.028349523125),
      linearUnit('st', 'Stone', 6.35029318),
    ],
  },
  {
    id: 'temperature',
    label: 'Temperature',
    units: [
      { id: 'c', label: 'Celsius', toBase: (v) => v, fromBase: (v) => v },
      { id: 'f', label: 'Fahrenheit', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { id: 'k', label: 'Kelvin', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  {
    id: 'area',
    label: 'Area',
    units: [
      linearUnit('mm2', 'Square millimeters', 0.000001),
      linearUnit('cm2', 'Square centimeters', 0.0001),
      linearUnit('m2', 'Square meters', 1),
      linearUnit('hectare', 'Hectares', 10_000),
      linearUnit('km2', 'Square kilometers', 1_000_000),
      linearUnit('in2', 'Square inches', 0.00064516),
      linearUnit('ft2', 'Square feet', 0.09290304),
      linearUnit('yd2', 'Square yards', 0.83612736),
      linearUnit('acre', 'Acres', 4046.8564224),
      linearUnit('mi2', 'Square miles', 2_589_988.110336),
    ],
  },
  {
    id: 'volume',
    label: 'Volume (Liquids)',
    units: [
      linearUnit('ml', 'Milliliters', 0.001),
      linearUnit('l', 'Liters', 1),
      linearUnit('m3', 'Cubic meters', 1000),
      linearUnit('tsp', 'Teaspoons', 0.00492892159375),
      linearUnit('tbsp', 'Tablespoons', 0.0147867647813),
      linearUnit('flOz', 'Fluid ounces (US)', 0.0295735295625),
      linearUnit('cup', 'Cups (US)', 0.2365882365),
      linearUnit('pint', 'Pints (US)', 0.473176473),
      linearUnit('quart', 'Quarts (US)', 0.946352946),
      linearUnit('gallon', 'Gallons (US)', 3.785411784),
    ],
  },
  {
    id: 'pressure',
    label: 'Pressure',
    units: [
      linearUnit('pa', 'Pascals', 1),
      linearUnit('kpa', 'Kilopascals', 1000),
      linearUnit('bar', 'Bar', 100_000),
      linearUnit('psi', 'PSI', 6894.757293168),
      linearUnit('atm', 'Atmospheres', 101_325),
      linearUnit('mmhg', 'mmHg', 133.322387415),
    ],
  },
  {
    id: 'speed',
    label: 'Speed',
    units: [
      linearUnit('mps', 'Meters/second', 1),
      linearUnit('kph', 'Kilometers/hour', 1 / 3.6),
      linearUnit('mph', 'Miles/hour', 0.44704),
      linearUnit('knot', 'Knots', 0.514444444),
      linearUnit('fps', 'Feet/second', 0.3048),
    ],
  },
  {
    id: 'time',
    label: 'Time',
    units: [
      linearUnit('ms', 'Milliseconds', 0.001),
      linearUnit('s', 'Seconds', 1),
      linearUnit('min', 'Minutes', 60),
      linearUnit('hour', 'Hours', 3600),
      linearUnit('day', 'Days', 86_400),
      linearUnit('week', 'Weeks', 604_800),
    ],
  },
  {
    id: 'data',
    label: 'Data Storage',
    units: [
      linearUnit('byte', 'Bytes', 1),
      linearUnit('kb', 'Kilobytes', 1024),
      linearUnit('mb', 'Megabytes', 1024 ** 2),
      linearUnit('gb', 'Gigabytes', 1024 ** 3),
      linearUnit('tb', 'Terabytes', 1024 ** 4),
    ],
  },
];

@Component({
  imports: [Button, DecimalPipe, FormsModule, PageHeader],
  selector: 'sap-unit-converter',
  styleUrl: './unit-converter.scss',
  templateUrl: './unit-converter.html',
})
export class UnitConverter {
  readonly categories = CATEGORIES;

  readonly categoryId = signal(CATEGORIES[0].id);
  readonly fromUnitId = signal(CATEGORIES[0].units[0].id);
  readonly toUnitId = signal(CATEGORIES[0].units[1].id);
  readonly value = signal(1);

  readonly category = computed(() => this.categories.find((c) => c.id === this.categoryId())!);
  readonly fromUnit = computed(() => this.category().units.find((u) => u.id === this.fromUnitId()));
  readonly toUnit = computed(() => this.category().units.find((u) => u.id === this.toUnitId()));

  readonly result = computed(() => {
    const fromUnit = this.fromUnit();
    const toUnit = this.toUnit();
    if (!fromUnit || !toUnit) {
      return null;
    }
    return toUnit.fromBase(fromUnit.toBase(this.value()));
  });

  onCategoryChange(categoryId: string): void {
    this.categoryId.set(categoryId);
    const units = this.categories.find((c) => c.id === categoryId)!.units;
    this.fromUnitId.set(units[0].id);
    this.toUnitId.set(units[1].id);
  }

  swap(): void {
    const from = this.fromUnitId();
    this.fromUnitId.set(this.toUnitId());
    this.toUnitId.set(from);
  }
}
