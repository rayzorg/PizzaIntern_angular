import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderResponse } from '../models/order-response';
import { OrderSummary } from '../models/orderSummary';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(
    private http: HttpClient,
    private auth: Auth,
  ) {}

  getUserOrders() {
    return this.http.get<OrderSummary[]>('http://localhost:8080/api/orders/myorders');
  }

  getOrderById(publicId: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`http://localhost:8080/api/orders/${publicId}`);
  }
}
