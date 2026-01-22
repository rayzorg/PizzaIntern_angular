import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPizzaAvailability } from './admin-pizza-availability';

describe('AdminPizzaAvailability', () => {
  let component: AdminPizzaAvailability;
  let fixture: ComponentFixture<AdminPizzaAvailability>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPizzaAvailability]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPizzaAvailability);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
