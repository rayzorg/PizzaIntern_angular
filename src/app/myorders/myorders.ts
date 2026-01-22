import { Component, OnInit } from '@angular/core';
import { OrderSummary } from '../models/orderSummary';
import { OrderService } from '../services/order';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-myorders',
  imports: [CommonModule],
  templateUrl: './myorders.html',
  styleUrl: './myorders.css',
})
export class Myorders implements OnInit {


expandedOrders = new Set<number>();

 order$!: Observable<OrderSummary[]>;
  loading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.order$=this.orderService.getUserOrders();
    this.order$.subscribe(o => console.log(o));


   
  }

  
toggle(orderId: number) {
  if (this.expandedOrders.has(orderId)) {
    this.expandedOrders.delete(orderId);
  } else {
    this.expandedOrders.add(orderId);
  }
}

isExpanded(orderId: number): boolean {
  return this.expandedOrders.has(orderId);
}
}
