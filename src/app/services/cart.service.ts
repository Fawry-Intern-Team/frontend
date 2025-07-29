import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { StoreProductResponse } from '../models/store-product-response.model';

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
  addToCart(product: StoreProductResponse) {
    const existingItem = this.items.find(
      (item) => item.product.productId === product.productId
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
  increaseQuantity(productId: string) {
    const item = this.items.find((i) => i.product.productId === productId);
    if (item) {
      item.quantity += 1;
    }
  }

  /**
   * Decrease the quantity of a product in the cart by 1.
   * If quantity becomes zero, remove it from the cart.
   */
  decreaseQuantity(productId: string) {
    const item = this.items.find((i) => i.product.productId === productId);
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.removeFromCart(productId);
      }
    }
  }

  /**
   * Remove a product completely from the cart.
   */
  removeFromCart(productId: string) {
    this.items = this.items.filter(
      (item) => item.product.productId !== productId
    );
  }

  /**
   * Clear the entire cart.
   */
  clearCart() {
    this.items = [];
  }
}
