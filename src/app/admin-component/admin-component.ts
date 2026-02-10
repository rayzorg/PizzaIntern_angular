import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Admin } from '../services/adminService';
import { AdminViewOrders } from '../models/admin-view-orders';

@Component({
  selector: 'app-admin-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.css',
})
export class AdminComponent implements OnInit {
  order$!: Observable<AdminViewOrders[]>;
  expandedOrderIds = new Set<number>();
  sortDirection: 'asc' | 'desc' = 'desc';
  emailFilter: string = '';
  dateFilter: 'today' | 'yesterday' | 'all' = 'today';
  showPreparingOnly = false;

  constructor(
    private adminService: Admin,
    private cdr: ChangeDetectorRef,
  ) {}

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

      return this.sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
    });
  }

  closeOrder(orderId: number) {
    this.adminService.closeOrder(orderId).subscribe({
      next: (updatedOrder) => {
        this.order$ = this.order$.pipe(
          map((orders) =>
            orders.map((o) => (o.orderId === updatedOrder.orderId ? updatedOrder : o)),
          ),
        );
        this.cdr.markForCheck();
      },
      error: (err) => {
        alert(err.error ?? 'Failed to close order');
      },
    });
  }
  togglePreparingOnly() {
    this.showPreparingOnly = !this.showPreparingOnly;
  }

  filteredOrders(orders: AdminViewOrders[]) {
    let result = [...orders];

    //  Email filter
    if (this.emailFilter.trim().length >= 3) {
      const filter = this.emailFilter.toLowerCase();
      result = result.filter((order) => order.email.toLowerCase().startsWith(filter));
    }

    // Date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (this.dateFilter === 'today') {
      result = result.filter((order) => {
        const pickup = new Date(order.pickupTime);
        pickup.setHours(0, 0, 0, 0);
        return pickup.getTime() === today.getTime();
      });
    }

    if (this.dateFilter === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      result = result.filter((order) => {
        const pickup = new Date(order.pickupTime);
        pickup.setHours(0, 0, 0, 0);
        return pickup.getTime() === yesterday.getTime();
      });
    }
    //  Status filter (PREPARING only)
    if (this.showPreparingOnly) {
      result = result.filter((order) => order.status === 'PREPARING');
    }

    // Sorting
    result.sort((a, b) => {
      const timeA = new Date(a.pickupTime).getTime();
      const timeB = new Date(b.pickupTime).getTime();

      return this.sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
    });

    return result;
  }

  setDateFilter(filter: 'today' | 'yesterday' | 'all') {
    this.dateFilter = filter;
  }
}
