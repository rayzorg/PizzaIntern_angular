import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart';
import { CartItem } from '../models/cart-item';
import { OrderService } from '../services/order';
import { FormsModule } from '@angular/forms'; 
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';



@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart {

  cartItems$;
  order:any;
  pickupTime:string;
  email:string='';

errorMessages: string[] = [];
isSubmitting = false;
 



  constructor(private auth:Auth,private orderService: OrderService,private cartService: CartService,    private cdr: ChangeDetectorRef,
 private router: Router) {
    this.orderService=orderService;
   this.cartItems$= this.cartService.cartItems$;
   

   const now = new Date();
   now.setMinutes(now.getMinutes() + 15);
   const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  this.pickupTime = `${year}-${month}-${day}T${hours}:${minutes}`;

   this.auth.username$.subscribe(email => {
      if (email) {
        this.email = email;
      }
    });
  }

   
  increase(item: CartItem): void {
    this.cartService.addPizza({
      id: item.pizzaId,
      name: item.name,
      price: item.price,
      toppings: item.toppings,
      available: true,
      size:item.size,
      imageUrl:item.imageUrl,
      description: ''
    },item.size,1);
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
     this.cartService.placeOrder(this.pickupTime, this.email).subscribe({
  next: response => {
    this.errorMessages = [];
    alert(`Order placed! Order ID: ${response.orderId}. Pickup at ${new Date(response.pickupTime!).toLocaleString()}`);
    this.cartService.clear();
    this.router.navigate(['/order-confirmation', response.orderId]);
  },
  error: err => {
    this.errorMessages = []; 

    if (err.status === 400) {
      console.log('ERROR RECEIVED:', err.error);

     
      if (Array.isArray(err.error)) {
        this.errorMessages.push(...err.error); 
      } else {
        this.errorMessages.push(err.error); 
      }

      this.cdr.markForCheck();
    } else {
      this.errorMessages.push('Something went wrong. Please try again.');
    }
  }
});

}
}
