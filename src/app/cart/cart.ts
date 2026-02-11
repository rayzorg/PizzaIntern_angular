import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cartService';
import { CartItem } from '../models/cart-item';
import { OrderService } from '../services/orderService';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/authService';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class Cart {
  cartItems$;
  order: any;
  pickupTime: string;
  email: string = '';
  fieldErrors: { [key: string]: string } = {};
  errorMessages: string[] = [];
  isSubmitting = false;

  constructor(
    private auth: Auth,
    private orderService: OrderService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
    this.orderService = orderService;
    this.cartItems$ = this.cartService.cartItems$;

    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    this.pickupTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    this.auth.username$.subscribe((email) => {
      if (email) {
        this.email = email;
      }
    });
  }

  increase(item: CartItem): void {
    this.cartService.addPizza(
      {
        id: item.pizzaId,
        name: item.name,
        price: item.price,
        toppings: item.toppings,
        available: true,
        size: item.size,
        imageUrl: item.imageUrl,
        description: '',
      },
      item.size,
      1,
    );
  }

  decrement(item: CartItem) {
    this.cartService.decrementPizza(item.pizzaId, item.size);
  }
  remove(item: CartItem): void {
    this.cartService.removePizza(item.pizzaId);
  }

  clear(): void {
    this.cartService.clear();
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  placeOrder() {
  this.errorMessages = [];
  this.fieldErrors = {};

  this.cartService.placeOrder(this.pickupTime, this.email).subscribe({
    next: (response) => {
      this.cartService.clear();
      this.router.navigate(['/order-confirmation', response.publicId]);
    },
    error: (err) => {
      if (err.status === 400 && Array.isArray(err.error)) {
        err.error.forEach((msg: string) => {
           this.errorMessages.push(msg);
          const parts = msg.split(':');
          if (parts.length === 2) {
            const field = parts[0].trim();
            const message = parts[1].trim();
            this.fieldErrors[field] = message;
          } else {
            this.errorMessages.push(msg);
          }
        });
      } else {
        this.errorMessages = ['Something went wrong. Please try again.'];
      }

      this.cdr.markForCheck();
    },
  });
}

}
