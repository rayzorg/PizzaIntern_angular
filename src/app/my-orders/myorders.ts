import { Component, OnInit } from '@angular/core';
import { OrderSummary } from '../models/orderSummary';
import { OrderService } from '../services/orderService';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-myorders',
  imports: [CommonModule],
  templateUrl: './myorders.html',
  styleUrl: './myorders.css',
})
export class Myorders implements OnInit {
  expandedOrders = new Set<string>();

  order$!: Observable<OrderSummary[]>;
  loading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.order$ = this.orderService.getUserOrders();
    this.order$.subscribe((o) => console.log(o));
  }

  toggle(publicId: string) {
    if (this.expandedOrders.has(publicId)) {
      this.expandedOrders.delete(publicId);
    } else {
      this.expandedOrders.add(publicId);
    }
  }

  isExpanded(publicId: string): boolean {
    return this.expandedOrders.has(publicId);
  }
}
