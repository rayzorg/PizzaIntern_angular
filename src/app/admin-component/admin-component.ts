import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Admin } from '../services/admin';
import { AdminViewOrders } from '../models/admin-view-orders';

@Component({
  selector: 'app-admin-component',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css',
})
export class AdminComponent implements OnInit{

order$!: Observable<AdminViewOrders[]>;
expandedOrderIds = new Set<number>();
sortDirection: 'asc' | 'desc' = 'desc';


  constructor(private adminService: Admin,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.order$ = this.adminService.getAllOrders();
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
  this.adminService.closeOrder(orderId).subscribe({
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
