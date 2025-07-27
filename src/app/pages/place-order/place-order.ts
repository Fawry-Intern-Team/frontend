import { Component } from '@angular/core';
import { OrderService, OrderProduct, OrderRequest } from '../../services/order-service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
@Component({
  selector: 'app-place-order',
  imports: [],
  templateUrl: './place-order.html',
  styleUrl: './place-order.css'
})
export class PlaceOrder {
  constructor(private orderService: OrderService,private router:Router) { }

  placeOrder() {
    const orderProducts: OrderProduct[] = [
      {
        productId: '11111111-1111-1111-1111-111111111111',
        storeId: '22222222-2222-2222-2222-222222222222',
        quantity: 2
      }
    ];
    if(localStorage.getItem('orderIdempotencyKey') === null) {
      localStorage.setItem('orderIdempotencyKey', uuidv4());
    }
    const idempotencyKey =localStorage.getItem('orderIdempotencyKey');
    const order: OrderRequest = {
      customerId: '99999999-9999-9999-9999-999999999999',
      couponCode: '123456789',
      idempotencyKey: idempotencyKey,
      totalAmount: 200,
      orderProducts
    };
   
    this.orderService.createOrder(order).subscribe({
      next: (res) => {
        console.log('✅ Order Created', res);
        this.router.navigate(['/payment']);
      },
      error: (err) => {
        console.error('❌ Error creating order', err);
      }
    });
  }
}
