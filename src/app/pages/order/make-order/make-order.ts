import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { OrderService } from '../../../services/order-service';
import { Order } from '../../../models/Order';

@Component({
  selector: 'app-make-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './make-order.html',
  styleUrls: ['./make-order.css'],
})
export class MakeOrder implements OnInit {
  orderForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      customerId: [null, Validators.required],
      couponCode: [''],
      totalAmount: [100.00],
      orderProducts: this.fb.array([this.createProductForm()]), // ✅ renamed
    });
  }

  get orderProducts(): FormArray {
    return this.orderForm.get('orderProducts') as FormArray;
  }

  createProductForm(): FormGroup {
    return this.fb.group({
      productId: [null, Validators.required],
      storeId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  addProduct(): void {
    this.orderProducts.push(this.createProductForm());
  }

  removeProduct(index: number): void {
    this.orderProducts.removeAt(index);
  }

  submitOrder(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const order: Order = this.orderForm.value;

    this.orderService.createOrder(order).subscribe({
      next: createdOrder => {
        console.log('Order placed:', createdOrder);
        this.router.navigate(['/orders/payment']);
      },
      error: err => {
        console.error('Failed to place order', err);
      },
    });
  }
}
