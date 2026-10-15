import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorConverter } from './color-converter';

describe('ColorConverter', () => {
  let component: ColorConverter;
  let fixture: ComponentFixture<ColorConverter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorConverter],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorConverter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
