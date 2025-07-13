import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../models/Order';
import { mockOrders } from '../../../mock-data/orders.mock';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, TableModule,RouterModule],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css'
})
export class OrderDetails {
  order: Order | undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.order = mockOrders.find(o => o.id === id);
  }
}
