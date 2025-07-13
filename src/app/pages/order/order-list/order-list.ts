import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { Order } from '../../../models/Order';
import { mockOrders } from '../../../mock-data/orders.mock';
@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, TableModule, RouterModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css'
})
export class OrderList {
orders: Order[] = [];

  ngOnInit(): void {
    this.orders = mockOrders;
  }
}
