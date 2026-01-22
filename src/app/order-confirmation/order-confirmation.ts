import { Component } from '@angular/core';
import { OrderResponse } from '../models/order-response';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { OrderService } from '../services/order';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-order-confirmation',
  imports: [CommonModule],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.css',
})
export class OrderConfirmation implements OnInit {

  order$!: Observable<OrderResponse>; 

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
console.log('ORDER ID FROM ROUTE:', id);



 this.order$ = this.orderService.getOrderById(id);
 this.order$.subscribe(order => {
    console.log('ORDER RECEIVED:', order);
  });


  }
}
