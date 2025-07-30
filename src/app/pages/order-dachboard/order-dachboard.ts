
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, OrderResponse } from '../../services/order-service';
export interface OrderResponseDTO {
  id: string;
  customerId: string;
  totalAmount: number;
  couponCode?: string;
  transactionId: string;
  status: OrderStatus;
  createdAt: string;
  orderProducts: OrderProductResponseDTO[];
}

export interface OrderProductResponseDTO {
  productId: string;
  quantity: number;
  storeId: string;
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
  transactionId: string;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

@Component({
  selector: 'app-order-dachboard',
  imports: [TableModule, ButtonModule, DialogModule, InputTextModule, ToastModule, ConfirmDialogModule, TooltipModule, CommonModule, FormsModule],
  providers: [MessageService, ConfirmationService],
  standalone: true,
  templateUrl: './order-dachboard.html',
  styleUrl: './order-dachboard.css'
})
export class OrderDachboard implements OnInit {
  orders: OrderResponseDTO[] = [];
  loading = false;
  updating = false;
  //pagination
  page = 0;
  size = 10;



  // Stats
  totalOrders = 0;
  completedOrders = 0;
  processingOrders = 0;
  totalRevenue = 0;
  totalRecords = 0;

  // Filters
  searchQuery = '';
  selectedStatus: string | null = null;
  fromDate = '';
  toDate = '';

  // Dialog states
  statusDialogVisible = false;
  detailsDialogVisible = false;
  selectedOrder: OrderResponseDTO | null = null;
  newStatus = '';

  // Options - removed dropdown options since we're using native selects

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getAllOrders(this.size, this.page, this.selectedStatus, this.searchQuery).subscribe({
      next: (data) => {
        this.orders = data.content
        this.totalRecords = data.totalElements;
        this.updateStats();
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load orders'
        });
        console.error('Error loading orders:', error);
      }
    });

  }
  loadOrdersLazy(event: any) {
    this.page = event.first / event.rows;
    this.size = event.rows;
    this.loadOrders();
  }

  onSearch() {
    this.loadOrders();
  }

  onStatusFilter() {
    this.loadOrders();
  }

  onDateFilter() {
    //this.loadOrders();
  }


  clearFilters() {
    this.searchQuery = '';
    this.selectedStatus = null;
    this.fromDate = '';
    this.toDate = '';
    this.page = 0;
    this.size = 10;
    this.loadOrders();
  }

  openStatusDialog(order: OrderResponseDTO) {
    this.selectedOrder = order;
    this.newStatus = '';
    this.statusDialogVisible = true;
  }

  updateOrderStatus() {
    if (!this.selectedOrder || !this.newStatus) return;

    this.updating = true;

    const updateData: UpdateOrderStatusDTO = {
      status: this.newStatus as OrderStatus,
      transactionId: this.selectedOrder.transactionId
    };

    // Replace with your actual API service call
    setTimeout(() => {
      if (this.selectedOrder) {
        this.selectedOrder.status = this.newStatus as OrderStatus;
        this.updateStats();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Order status updated successfully'
        });
      }

      this.updating = false;
      this.statusDialogVisible = false;
    }, 1000);
  }

  viewOrderDetails(order: OrderResponseDTO) {
    this.selectedOrder = order;
    this.detailsDialogVisible = true;
  }



  getStatusClass(status: OrderStatus): string {
    const statusClasses = {
      [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
      [OrderStatus.PROCESSING]: 'bg-purple-100 text-purple-800',
      [OrderStatus.SHIPPED]: 'bg-indigo-100 text-indigo-800',
      [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
      [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
      [OrderStatus.COMPLETED]: 'bg-green-100 text-green-800'
    };

    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  getTotalProductCount(products: OrderProductResponseDTO[]): number {
    return products.reduce((total, product) => total + product.quantity, 0);
  }

  private updateStats() {
    this.totalOrders = this.orders.length;
    this.processingOrders = this.orders.filter(o => o.status === OrderStatus.PROCESSING).length;
    this.completedOrders = this.orders.filter(o => o.status === OrderStatus.COMPLETED).length;
    this.totalRevenue = this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
  }


}