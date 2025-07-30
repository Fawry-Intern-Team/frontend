import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { StoreProductResponse } from '../../models/store-product-response.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProductCardComponent } from '../product-card/product-card.component';
import { SliderModule } from 'primeng/slider';



export const PRODUCTS: StoreProductResponse[] = [
  {
    productId: '3f6a9b2e-9f9f-4d2e-bc33-84d5f624db98',
    productName: 'Wireless Mouse',
    productDescription: 'Ergonomic wireless mouse with USB receiver',
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=60',
    price: 25.99,
    categoryName: 'Accessories',
    storeId: '6b3fc7d2-ff7e-4668-9d7f-ff2e149c4f93',
    storeName: 'Tech Hub',
    storeLocation: 'New York'
  },
  {
    productId: '53a6eb44-e39d-44de-a654-58ac74843f3d',
    productName: 'Mechanical Keyboard',
    productDescription: 'RGB backlit mechanical keyboard with blue switches',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1719289799376-d3de0ca4ddbc?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    price: 79.99,
    categoryName: 'Accessories',
    storeId: '6b3fc7d2-ff7e-4668-9d7f-ff2e149c4f93',
    storeName: 'Tech Hub',
    storeLocation: 'New York'
  },
  {
    productId: 'b115748e-27e8-4c9f-bf6d-2a1f29f9334e',
    productName: '27" 4K Monitor',
    productDescription: 'Ultra HD monitor with HDMI and DisplayPort',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    price: 329.99,
    categoryName: 'Monitors',
    storeId: '7a1c9fd8-cf29-4af3-9fd3-4b8e5d5a41f1',
    storeName: 'Display World',
    storeLocation: 'San Francisco'
  },
  {
    productId: '7059e9a3-2b8a-4192-8801-f8bc356ad35e',
    productName: 'Gaming Headset',
    productDescription: 'Surround sound gaming headset with microphone',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    price: 49.99,
    categoryName: 'Audio',
    storeId: '4c37c2d1-9297-43db-93a7-2f0b50c4dc1a',
    storeName: 'Sound Station',
    storeLocation: 'Los Angeles'
  },
  {
    productId: 'cb5c128f-7583-4ac0-ae01-6435d2550fa4',
    productName: 'USB-C Charging Cable',
    productDescription: 'Durable USB-C to USB-A charging cable, 1.5m',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=799&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    price: 9.99,
    categoryName: 'Cables',
    storeId: '8e46b5ab-3e74-4eaa-b94c-6fd705f09d52',
    storeName: 'Cable Express',
    storeLocation: 'Seattle'
  }
];

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, SliderModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: StoreProductResponse[] = [];
  isLoading = true;

  searchKeyword: string = '';
  suggestions: string[] = [];
  private searchTerms = new Subject<string>();

  selectedCategory: string = '';
  categories: string[] = [];

  minPrice: number | null = null;
  maxPrice: number | null = null;

  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;
  sortBy: string = '';
  sortDirection: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    // this.products = PRODUCTS;
    // this.isLoading = false;
    this.fetchFilteredProducts();
    this.loadCategories();

    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => this.productService.getSuggestions(term))
      )
      .subscribe({
        next: (results) => (this.suggestions = results),
        error: (err) => console.error(err),
      });
  }

  loadCategories() {
    this.productService.getAllCategories().subscribe({
      next: (cats) => {
        this.categories = cats.map((cat) => cat.name);
      },
      error: (err) => console.error(err),
    });
  }

  fetchFilteredProducts(): void {
    this.isLoading = true;
    console.log("dsgsdfgdfgdsfg");
    this.productService
      .searchProductsFiltered({
        keyword: this.searchKeyword || undefined,
        category: this.selectedCategory || undefined,
        min: this.minPrice ?? undefined,
        max: this.maxPrice ?? undefined,
        sortBy: this.sortBy || 'id',
        sortDirection: this.sortDirection || 'asc',
        page: this.currentPage,
        size: this.pageSize,
      })
      .subscribe({
        next: (data) => {
          this.products = data.content;
          this.totalPages = data.totalPages;
          this.currentPage = data.number;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        },
      });
  }

  onSearchChange(term: any): void {
    const value = typeof term === 'string' ? term : term.target.value;
    if (value.length >= 1) {
      this.searchTerms.next(value);
    } else {
      this.suggestions = [];
      this.searchKeyword = '';
      this.currentPage = 0;
      this.fetchFilteredProducts();
    }
  }

  selectSuggestion(suggestion: string): void {
    this.searchKeyword = suggestion;
    this.suggestions = [];
    this.currentPage = 0;
    this.fetchFilteredProducts();
  }

  onCategoryChange(): void {
    this.currentPage = 0;
    this.fetchFilteredProducts();
  }

  onPriceChange(): void {
    this.currentPage = 0;
    this.fetchFilteredProducts();
  }

  changeSort(sortBy: string, sortDirection: string) {
    this.sortBy = sortBy;
    this.sortDirection = sortDirection;
    this.currentPage = 0;
    this.fetchFilteredProducts();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.fetchFilteredProducts();
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
