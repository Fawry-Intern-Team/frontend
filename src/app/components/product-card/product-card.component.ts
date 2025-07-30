import { Component, Input } from '@angular/core';
import { StoreProductResponse } from '../../models/store-product-response.model';
import { CartService } from '../../services/cart.service';
import { CommonModule, CurrencyPipe } from '@angular/common';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    CommonModule, 
    CurrencyPipe,
    CardModule,
    ButtonModule,
    ImageModule
  ],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() product!: StoreProductResponse;

  constructor(private cartService: CartService) {}

  addToCart() {
    this.cartService.addToCart(this.product);
  }
}