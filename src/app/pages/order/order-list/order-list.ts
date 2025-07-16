import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Order } from '../../../models/Order';
import { OrderService } from '../../../services/order-service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, TableModule, RouterModule, FormsModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css'
})
export class OrderList {
  orders: Order[] = [];
  search: string = '';
  totalRecords: number = 0;
  loading = false;

  // Pagination
  currentPage = 0;
  pageSize = 10;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders(this.currentPage, this.pageSize);
  }
  statusOptions = [
    { label: 'All', value: '' },
    { label: 'COMPLETED', value: 'COMPLETED' },
    { label: 'PENDING', value: 'PENDING' },
    { label: 'CANCELED', value: 'CANCELED' }
  ];

  startDate: string = '';
  endDate: string = '';
  selectedStatus: string = '';

  applyFilters(): void {
    this.loadOrders(this.currentPage, this.pageSize);
  }

  loadOrders(page: number, size: number): void {
    this.loading = true;
    this.orderService.getPaginatedOrders(page, size).subscribe({
      next: (res) => {
        this.orders = res.content;
        this.totalRecords = res.totalElements;
        this.loading = false;
        this.calculateSummaryStats()
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.first / this.pageSize;
    this.pageSize = event.rows;
    this.loadOrders(this.currentPage, this.pageSize);
  }
  totalOrders: number = 0;
  totalRevenue: number = 0;
  completedOrders: number = 0;

  calculateSummaryStats(): void {
    this.totalOrders = this.orders.length;
    this.completedOrders = this.orders.filter(o => o.status === 'COMPLETED').length;
    this.totalRevenue = this.orders
      .filter(o => o.status === 'COMPLETED')
      .reduce((sum, o) => sum + o.totalAmount, 0);
  }

}
