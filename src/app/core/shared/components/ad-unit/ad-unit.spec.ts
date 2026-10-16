import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdUnit } from './ad-unit';

describe('AdUnit', () => {
  let component: AdUnit;
  let fixture: ComponentFixture<AdUnit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdUnit],
    }).compileComponents();

    fixture = TestBed.createComponent(AdUnit);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('slot', '1234567890');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders no <ins> while AdSense is disabled (the default environment)', () => {
    expect(fixture.nativeElement.querySelector('ins.adsbygoogle')).toBeNull();
  });
});
