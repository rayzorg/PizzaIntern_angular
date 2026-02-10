import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cartService';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart-preview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-preview.html',
  styleUrls: ['./cart-preview.css'],
})
export class CartPreview {
  private cartService = inject(CartService);
  cartItems$ = this.cartService.cartItems$;

  getTotal(): number {
    return this.cartService.getTotal();
  }
}
