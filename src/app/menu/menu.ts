import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PizzaService } from '../services/pizza';
import { CartService } from '../services/cart';
import { CartPreview } from '../cart-preview/cart-preview';
import { FormsModule } from '@angular/forms';
import { Pizza } from '../models/pizza';
import { Observable } from 'rxjs';




@Component({
  standalone: true,
  imports: [CommonModule,CartPreview,FormsModule],
  selector: 'app-menu',
   templateUrl: './menu.html',
  styleUrls: ['./menu.css']


})
export class Menu implements OnInit {

  pizzas$!: Observable<Pizza[]>; 
  sizes = ['SMALL', 'MEDIUM', 'LARGE'] as const;
  selectedSize: Record<number, string> = {};
  quantities: Record<number, number> = {};

  constructor(
    private cartService: CartService,
    private pizzaService: PizzaService
  ) {}

  ngOnInit(): void {
    this.pizzas$ = this.pizzaService.getAllPizzas();

    this.pizzas$.subscribe(pizzas => {
      pizzas.forEach(p => {
        this.selectedSize[p.id] = 'MEDIUM';
        this.quantities[p.id] = 1;
      });
    });
  }

  addToCart(pizza: Pizza) {
    const size = this.selectedSize[pizza.id];
    const quantity = this.quantities[pizza.id];

    this.cartService.addPizza(pizza, size, quantity);
  }

  increaseQuantity(pizzaId: number) {
    this.quantities[pizzaId]++;
  }

  decreaseQuantity(pizzaId: number) {
    if (this.quantities[pizzaId] > 1) {
      this.quantities[pizzaId]--;
    }
  }
}
