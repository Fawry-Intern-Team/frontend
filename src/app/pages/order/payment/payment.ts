import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class Payment {
  paymentForm!: FormGroup;
  mockTotal = 259.99; // Simulated amount

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      cardName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      amount: [this.mockTotal, Validators.required],
      method: ['CARD', Validators.required],
    });

  }

  generateTransactionId(): string {
    return 'txn_' + Math.floor(Math.random() * 1000000);
  }

  submitPayment() {
    if (this.paymentForm.valid) {
      const data = this.paymentForm.value;
      console.log('✅ Payment processed (mock):', data);
      alert(`💳 Payment successful!\nCharged ${data.amount} to card ending in ${data.cardNumber.slice(-4)}`);
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.paymentForm.markAllAsTouched();
    }
  }

}
