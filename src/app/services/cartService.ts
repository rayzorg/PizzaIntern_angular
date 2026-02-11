import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { Pizza } from '../models/pizza';
import { HttpClient } from '@angular/common/http';
import { OrderResponse } from '../models/order-response';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  get items(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  private emit(items: CartItem[]) {
    this.cartItemsSubject.next([...items]);
  }
  constructor(private http: HttpClient) {}

  getItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addPizza(pizza: Pizza, size: string, quantity: number): void {
    const normalizedSize = size ?? 'M';
    const items = [...this.getItems()];

    const existing = items.find(
      (item) => item.pizzaId === pizza.id && item.size === normalizedSize,
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        pizzaId: pizza.id,
        name: pizza.name,
        price: pizza.price,
        quantity,
        size: normalizedSize,
        imageUrl: pizza.imageUrl,
        toppings: pizza.toppings,
      });
    }

    this.cartItemsSubject.next(items);
  }

  removePizza(pizzaId: number): void {
    const items = this.getItems().filter((i) => i.pizzaId !== pizzaId);
    this.cartItemsSubject.next(items);
  }

  removeItem(pizzaId: number, size: string) {
    const filtered = this.items.filter((item) => !(item.pizzaId === pizzaId && item.size === size));

    this.emit(filtered);
  }

  clear(): void {
    this.cartItemsSubject.next([]);
  }

  decrementPizza(pizzaId: number, size: string): void {
    const items = [...this.getItems()];

    const item = items.find((i) => i.pizzaId === pizzaId && i.size === size);
    if (!item) return;

    item.quantity -= 1;

    // If quantity is 0, remove the row
    const newItems =
      item.quantity > 0 ? items : items.filter((i) => !(i.pizzaId === pizzaId && i.size === size));

    this.cartItemsSubject.next(newItems);
  }

  getTotal(): number {
    return this.getItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  placeOrder(pickupTime: string, email: string) {
    const payload = {
      pickupTime,
      email,
      items: this.getItems().map((item) => ({
        pizzaId: item.pizzaId,
        size: item.size,
        quantity: item.quantity,
      })),
    };
    return this.http.post<OrderResponse>('http://localhost:8080/api/orders', payload);
  }
}
