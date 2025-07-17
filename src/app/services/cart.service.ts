import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: CartItem[] = [];

  /**
   * Get all items in the cart.
   */
  getItems(): CartItem[] {
    return this.items;
  }

  /**
   * Add a product to the cart.
   * If it exists, increase its quantity by 1.
   */
  addToCart(product: Product) {
    const existingItem = this.items.find(
      (item) => item.product.name === product.name
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }
  }

  /**
   * Increase the quantity of a product in the cart by 1.
   */
  increaseQuantity(productName: string) {
    const item = this.items.find((i) => i.product.name === productName);
    if (item) {
      item.quantity += 1;
    }
  }

  /**
   * Decrease the quantity of a product in the cart by 1.
   * If quantity becomes zero, remove it from the cart.
   */
  decreaseQuantity(productName: string) {
    const item = this.items.find((i) => i.product.name === productName);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.removeFromCart(productName);
      }
    }
  }

  /**
   * Remove a product completely from the cart.
   */
  removeFromCart(productName: string) {
    this.items = this.items.filter((item) => item.product.name !== productName);
  }

  /**
   * Clear the entire cart.
   */
  clearCart() {
    this.items = [];
  }
}
