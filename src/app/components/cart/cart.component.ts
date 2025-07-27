import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  constructor(public cartService: CartService) {}

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
}
