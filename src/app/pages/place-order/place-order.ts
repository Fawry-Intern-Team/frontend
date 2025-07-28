import { Component } from '@angular/core';
import { OrderService, OrderProduct, OrderRequest } from '../../services/order-service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-place-order',
  imports: [ToastModule],
  providers: [MessageService],
  standalone: true,
  templateUrl: './place-order.html',
  styleUrl: './place-order.css'
})
export class PlaceOrder {
  constructor(private orderService: OrderService,private router:Router,private messageService: MessageService) { }

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
