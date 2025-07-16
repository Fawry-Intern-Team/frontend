import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../models/Order';

import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../services/order-service';
@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, TableModule, RouterModule],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css'
})
export class OrderDetails {
  order: Order | undefined;

  constructor(private route: ActivatedRoute, private orderService: OrderService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.orderService.getOrderById(id || '').subscribe({
      next: order => {
        this.order = order
      },
      error: err => {
        console.error('Failed to place order', err);
      }
    })
  }
}
