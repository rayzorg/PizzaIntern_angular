import { Component } from '@angular/core';
import { OrderResponse } from '../models/order-response';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { OrderService } from '../services/orderService';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  imports: [CommonModule, RouterModule],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.css',
})
export class OrderConfirmation implements OnInit {
  order$!: Observable<OrderResponse>;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('publicId')!;

    this.order$ = this.orderService.getOrderById(id);
    this.order$.subscribe((order) => {
    });
  }
}
