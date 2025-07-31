import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { OrderService, OrderProduct, OrderRequest } from '../../services/order-service';
import { v4 as uuidv4 } from 'uuid';
import { Router, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  providers: [MessageService, ConfirmationService],
  imports: [
    CommonModule, 
    ButtonModule, 
    ToastModule, 
    FormsModule, 
    MessageModule, 
    CardModule, 
    PanelModule,
    BadgeModule,
    TooltipModule,
    ConfirmDialogModule,
    RouterModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  couponCode: string = '';

  constructor(
    public cartService: CartService, 
    private orderService: OrderService, 
    private router: Router, 
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  /**
   * Track by function for ngFor to improve performance
   */
  trackByProductId(index: number, item: CartItem): string {
    return item.product.productId;
  }

  /**
   * Increase quantity of a product
   */
  increaseQuantity(productId: string): void {
    this.cartService.increaseQuantity(productId);
    // this.showQuantityUpdateMessage('increased');
  }

  /**
   * Decrease quantity of a product
   */
  decreaseQuantity(productId: string): void {
    this.cartService.decreaseQuantity(productId);
    // this.showQuantityUpdateMessage('decreased');
  }

  /**
   * Remove item from cart with confirmation
   */
  removeFromCart(productId: string): void {
    const item = this.cartService.getItems().find(i => i.product.productId === productId);
    if (!item) return;

    this.confirmationService.confirm({
      message: `Are you sure you want to remove "${item.product.productName}" from your cart?`,
      header: 'Remove Item',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.cartService.removeFromCart(productId);
        this.messageService.add({
          severity: 'success',
          summary: 'Item Removed',
          detail: `${item.product.productName} has been removed from your cart`,
          life: 3000
        });
      }
    });
  }

  /**
   * Clear entire cart with confirmation
   */
  confirmClearCart(): void {
    if (this.cartService.getItems().length === 0) return;

    this.confirmationService.confirm({
      message: 'Are you sure you want to remove all items from your cart? This action cannot be undone.',
      header: 'Clear Cart',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.clearCart();
      }
    });
  }

  /**
   * Clear cart
   */
  clearCart(): void {
    const itemCount = this.cartService.getItems().length;
    this.cartService.clearCart();
    this.messageService.add({
      severity: 'success',
      summary: 'Cart Cleared',
      detail: `${itemCount} item(s) removed from your cart`,
      life: 3000
    });
  }

  /**
   * Apply coupon code
   */
  applyCoupon(): void {
    if (!this.couponCode.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Coupon',
        detail: 'Please enter a coupon code',
        life: 3000
      });
      return;
    }

    // Here you would typically validate the coupon with your backend
    this.messageService.add({
      severity: 'info',
      summary: 'Coupon Applied',
      detail: `Coupon "${this.couponCode}" has been applied`,
      life: 3000
    });
  }

  /**
   * Place order
   */
  placeOrder(): void {
    if (this.cartService.getItems().length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Empty Cart',
        detail: 'Please add items to your cart before placing an order',
        life: 3000
      });
      return;
    }

    const orderProducts: OrderProduct[] = [];
    this.cartService.getItems().forEach(item => {
      orderProducts.push({
        productId: item.product.productId,
        storeId: item.product.storeId,
        quantity: item.quantity
      });
    });

    const totalAmount = this.cartService.getItems().reduce(
      (sum, item) => sum + (item.product.price * item.quantity), 
      0
    );

    if (localStorage.getItem('orderIdempotencyKey') === null) {
      localStorage.setItem('orderIdempotencyKey', uuidv4());
    }
    
    const idempotencyKey = localStorage.getItem('orderIdempotencyKey');
    const order: OrderRequest = {
      customerId: '99999999-9999-9999-9999-999999999999',
      couponCode: this.couponCode,
      idempotencyKey: idempotencyKey,
      totalAmount: totalAmount,
      orderProducts
    };

    // Show loading toast
    this.messageService.add({
      severity: 'info',
      summary: 'Processing Order',
      detail: 'Please wait while we process your order...',
      life: 3000
    });

    // Uncomment when ready to integrate with backend
    // this.orderService.createOrder(order).subscribe({
    //   next: (res) => {
    //     localStorage.setItem('orderId', res.id);
    //     this.messageService.add({ 
    //       severity: 'success', 
    //       summary: 'Order Placed Successfully!', 
    //       detail: 'Redirecting to order summary...',
    //       life: 2000
    //     });
    //     setTimeout(() => {
    //       this.router.navigate(['/order-summary']);
    //     }, 2000);
    //   },
    //   error: (err) => {
    //     this.messageService.add({ 
    //       severity: 'error', 
    //       summary: 'Order Failed', 
    //       detail: err.error || 'An error occurred while placing your order'
    //     });
    //   }
    // });
  }

  /**
   * Show quantity update message
   */
  private showQuantityUpdateMessage(action: 'increased' | 'decreased'): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Quantity Updated',
      detail: `Item quantity ${action}`,
      life: 2000
    });
  }

  /**
   * Get formatted item count text
   */
  getItemCountText(): string {
    const count = this.cartService.getItems().length;
    return count === 1 ? '1 item' : `${count} items`;
  }

  /**
   * Check if cart has items
   */
  hasItems(): boolean {
    return this.cartService.getItems().length > 0;
  }
}