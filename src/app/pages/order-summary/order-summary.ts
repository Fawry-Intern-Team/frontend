import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { OrderService, OrderResponse } from '../../services/order-service';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart.model';
@Component({
  selector: 'app-order-summary',
  imports: [ReactiveFormsModule, CommonModule, ButtonModule, InputTextModule, ToastModule],
  providers: [MessageService],
  standalone: true,
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.css'
})
export class OrderSummary {
  order: OrderResponse | null = null;
  orderProducts: CartItem[] = [];
  constructor(private fb: FormBuilder, private router: Router, private messageService: MessageService, private orderService: OrderService,
              private cartService: CartService) { 
  }
  ngOnInit() {
    this.orderProducts = this.cartService.getItems();
    const orderId = localStorage.getItem('orderId');
    if (orderId) {
      this.orderService.getOrderById(orderId).subscribe({
        next: (response) => {
          this.order = response;
        },
        error: (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch order details.' });
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No order found.' });
      this.router.navigate(['/place-order']);
    }
  }

  getSubtotal(): number {
    if (!this.orderProducts) return 0;
    return this.orderProducts.reduce(
      (sum: number, p: any) => sum + 100 * p.quantity,
      0
    );
  }
  onCheckout() {
    if (this.order?.status==='PROCESSING') {
      localStorage.setItem('orderAmount', this.order.totalAmount.toString());
      this.router.navigate(['/payment']);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'order is invalid' });
    }
  }
   
}
