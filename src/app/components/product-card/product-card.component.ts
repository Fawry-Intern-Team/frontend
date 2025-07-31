import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StoreProductResponse } from '../../models/store-product-response.model';
import { CartService } from '../../services/cart.service';
import { CommonModule, CurrencyPipe } from '@angular/common';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule, 
    CurrencyPipe,
    CardModule,
    ButtonModule,
    ImageModule,
    DialogModule,
  ],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() product!: StoreProductResponse;

  constructor(private cartService: CartService) {}

  @Output() quickView = new EventEmitter<StoreProductResponse>();

  openQuickView() {
    this.quickView.emit(this.product);
  }

  addToCart() {
    this.cartService.addToCart(this.product);
  }
}