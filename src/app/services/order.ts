import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderResponse } from '../models/order-response';
import { OrderSummary } from '../models/orderSummary';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient,private auth:Auth) {}

  getOrderHistory(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}`);
  }
  getUserOrders() {
    return this.http.get<OrderSummary[]>(
    'http://localhost:8080/api/orders/myorders'
  );
  }


getOrderById(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`http://localhost:8080/api/orders/${id}`);
  }

    getAllOrders() {
  return this.http.get<OrderResponse[]>(
    'http://localhost:8080/api/admin/orders'
  );
}

closeOrder(orderId: number) {
  return this.http.put<OrderResponse>(
    `http://localhost:8080/api/admin/orders/${orderId}/close`,
    {}
  );
}

}
