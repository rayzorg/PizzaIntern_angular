import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order';
import { Observable } from 'rxjs';
import { OrderResponse } from '../models/order-response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-admin-component',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css',
})
export class AdminComponent implements OnInit{

order$!: Observable<OrderResponse[]>;
expandedOrderIds = new Set<number>();
sortDirection: 'asc' | 'desc' = 'desc';


  constructor(private orderService: OrderService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.order$ = this.orderService.getAllOrders();
  }
  toggle(orderId: number) {
    if (this.expandedOrderIds.has(orderId)) {
      this.expandedOrderIds.delete(orderId);
    } else {
      this.expandedOrderIds.add(orderId);
    }
  }

  isExpanded(orderId: number): boolean {
    return this.expandedOrderIds.has(orderId);
  }

 sortByPickupTime() {
  this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
}

sortedOrders(orders: any[]) {
  return [...orders].sort((a, b) => {
    const timeA = new Date(a.pickupTime).getTime();
    const timeB = new Date(b.pickupTime).getTime();

    return this.sortDirection === 'asc'
      ? timeA - timeB
      : timeB - timeA;
  });
}


closeOrder(orderId: number) {
  this.orderService.closeOrder(orderId).subscribe({
    next: updatedOrder => {
      this.order$ = this.order$.pipe(
        map(orders =>
          orders.map(o =>
            o.orderId === updatedOrder.orderId ? updatedOrder : o
          )
        )
      );
      this.cdr.markForCheck();
    },
    error: err => {
      alert(err.error ?? 'Failed to close order');
    }
  });
}


}
