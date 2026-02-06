import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminViewOrders } from '../models/admin-view-orders';
@Injectable({
  providedIn: 'root',
})
export class Admin {
  constructor(private http: HttpClient) {}

    getAllOrders() {
  return this.http.get<AdminViewOrders[]>(
    'http://localhost:8080/api/admin/orders'
  );
}

closeOrder(orderId: number) {
  return this.http.put<AdminViewOrders>(
    `http://localhost:8080/api/admin/orders/${orderId}/close`,
    {}
  );
}
}
