import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { OrderService, OrderProduct, OrderRequest } from '../../services/order-service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-cart',
  standalone: true,
   providers: [MessageService],
  imports: [CommonModule, ButtonModule, ToastModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  constructor(public cartService: CartService,private orderService: OrderService,private router:Router,private messageService: MessageService) {}

  increaseQuantity(productName: string) {
    this.cartService.increaseQuantity(productName);
  }

  decreaseQuantity(productName: string) {
    this.cartService.decreaseQuantity(productName);
  }

  removeFromCart(productName: string) {
    this.cartService.removeFromCart(productName);
  }

  clearCart() {
    this.cartService.clearCart();
  }
  
  placeOrder() {
    const orderProducts: OrderProduct[] = [
      {
        productId: 'c0c1ccc7-cf1a-4aeb-a5b9-cd14df4d067c',
        storeId: '085ce62f-82c2-4266-9020-476ebaf2f884',
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
        localStorage.setItem('orderId', res.id);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Order placed successfully!' });
        setTimeout(() => {  
          this.router.navigate(['/order-summary']);
        }, 2000);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error });
      }
    });
  }
}
