import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  suggestions: string[] = [];

  isLoading = true;
  searchKeyword: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data: Product[]) => {
        console.log(
          'Category Name:',
          data.map((product) => product.categoryName)
        );

        this.products = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching products:', error);
        this.isLoading = false;
      },
    });
  }

  search(): void {
    if (!this.searchKeyword.trim()) {
      this.fetchProducts();
      return;
    }
    this.productService.searchProducts(this.searchKeyword).subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error(err),
    });
  }
  
}
