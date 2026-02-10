import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartPreview } from './cart-preview';

describe('CartPreview', () => {
  let component: CartPreview;
  let fixture: ComponentFixture<CartPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartPreview],
    }).compileComponents();

    fixture = TestBed.createComponent(CartPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
