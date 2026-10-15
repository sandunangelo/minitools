import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnitConverter } from './unit-converter';

describe('UnitConverter', () => {
  let component: UnitConverter;
  let fixture: ComponentFixture<UnitConverter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitConverter],
    }).compileComponents();

    fixture = TestBed.createComponent(UnitConverter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
