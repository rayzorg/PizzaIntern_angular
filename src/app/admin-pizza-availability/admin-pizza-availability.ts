import { Component, OnInit } from '@angular/core';
import { PizzaService } from '../services/pizza';
import { Pizza } from '../models/pizza';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-admin-pizza-availability',
  imports: [CommonModule],
  templateUrl: './admin-pizza-availability.html',
  styleUrl: './admin-pizza-availability.css',
})
export class AdminPizzaAvailability implements OnInit {
  pizzas$!: Observable<Pizza[]>;
  constructor(
    private pizzaService: PizzaService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.pizzas$ = this.pizzaService.getAllPizzas();
  }
  toggle(pizza: Pizza) {
    this.pizzaService.updateAvailability(pizza.id, !pizza.available).subscribe(() => {
      pizza.available = !pizza.available;
      this.cdr.markForCheck();
    });
  }
}
