import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { PaymentService, InitiateTransactionRequest } from '../../services/PaymentService';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-payment',
  imports: [ReactiveFormsModule, CommonModule, ButtonModule, InputTextModule, ToastModule],
  providers: [MessageService],
  standalone: true,
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class Payment {
  form: FormGroup;
  amount: number = parseFloat(localStorage.getItem('orderAmount') || '0');
  constructor(private fb: FormBuilder, private paymentService: PaymentService, private router: Router, private messageService: MessageService) {
    this.form = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      cardHolderName: ['', [Validators.required, Validators.minLength(3)]],
    });
  }


  onSubmit() {
    if (localStorage.getItem("paymentIdempotencyKey") === null) {
      localStorage.setItem("paymentIdempotencyKey", uuidv4());
    }

    const idempotencyKey = localStorage.getItem("paymentIdempotencyKey");
    const initiateTransactionRequest: InitiateTransactionRequest = {
      idempotencyKey: idempotencyKey,
      cardNumber: this.form.value.cardNumber,
      amount: this.amount,
      transactionType: 'DEPOSIT'
    };


    this.paymentService.initiateTransaction(initiateTransactionRequest).subscribe({
      next: (response) => {
        localStorage.setItem('transactionId', response.transactionId);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: response.message
        });
        setTimeout(() => {
          this.router.navigate(['/otp']);
        }, 2000);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error
        });
      }
    });
  }
}
