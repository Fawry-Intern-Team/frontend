import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PaymentService, ConfirmTransactionRequest } from '../../services/PaymentService';
import { OrderService, OrderStatusUpdateRequest } from '../../services/order-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-otp',
  imports: [ReactiveFormsModule, CommonModule, ButtonModule, InputTextModule, ToastModule],
  providers: [MessageService],
  standalone: true,
  templateUrl: './otp.html',
  styleUrl: './otp.css'
})
export class Otp {
  form: FormGroup;
  constructor(private fb: FormBuilder, private paymentService: PaymentService, private messageService: MessageService, private orderService: OrderService, private router: Router) {
    this.form = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{6}$')]],
    });
  }
  onSubmit() {
    const confirmTransactionRequest: ConfirmTransactionRequest = {
      otp: this.form.get('otp')?.value,
      transactionId: localStorage.getItem('transactionId')
    }
    this.paymentService.confirmTransaction(confirmTransactionRequest).subscribe({
      next: (response) => {
        const orderStatusUpdateRequest: OrderStatusUpdateRequest = {
          status: 'COMPLETED',
          transactionId: localStorage.getItem('transactionId') || null
        };
        const orderId = localStorage.getItem('orderId') || '';
        this.orderService.updateOrderStatus(orderId, orderStatusUpdateRequest).subscribe({
          next: (orderResponse) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Transaction confirmed and order status updated to PROCESSING!'
            });
            localStorage.clear();
            setTimeout(() => {
              this.router.navigate(['/products']);
            }, 2000);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update order status.'
            });
          }
        });
      },
      error: (error) => {
        console.error('Error confirmed transaction', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });
      }
    })
  }

}
