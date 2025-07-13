import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule,Router } from '@angular/router';
@Component({
  selector: 'app-make-order',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './make-order.html',
  styleUrl: './make-order.css'
})
export class MakeOrder {
 orderForm!: FormGroup;

  constructor(private fb: FormBuilder,private router: Router) {}

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      customerId: [null, Validators.required],
      couponCode: [''],
      products: this.fb.array([this.createProductForm()]),
    });
  }

  get products(): FormArray {
    return this.orderForm.get('products') as FormArray;
  }

  createProductForm(): FormGroup {
    return this.fb.group({
      productId: [null, Validators.required],
      storeId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  addProduct(): void {
    this.products.push(this.createProductForm());
  }

  removeProduct(index: number): void {
    this.products.removeAt(index);
  }

  submitOrder(): void {
    if (this.orderForm.valid) {
      const order = this.orderForm.value;
      console.log('Order Submitted:', order);
      alert('✅ Order created (mocked)');
      this.orderForm.reset();
      this.router.navigate(['/orders/payment']);
    } else {
      this.orderForm.markAllAsTouched();
    }
  }
}
