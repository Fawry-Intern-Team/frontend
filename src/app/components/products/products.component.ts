import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProductCardComponent } from '../product-card/product-card.component';
import { SliderModule } from 'primeng/slider';


 const PRODUCTS: Product[] = [
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with USB receiver',
    price: 25.99,
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=60',
    stockQuantity: 120,
    categoryName: 'Accessories',
    createdAt: '2025-07-01T10:00:00Z',
    updatedAt: '2025-07-15T08:30:00Z',
    deletedAt: null,
    isDeleted: false
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with blue switches',
    price: 79.99,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1719289799376-d3de0ca4ddbc?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stockQuantity: 60,
    categoryName: 'Accessories',
    createdAt: '2025-06-20T14:15:00Z',
    updatedAt: '2025-07-10T09:45:00Z',
    deletedAt: null,
    isDeleted: false
  },
  {
    name: '27" 4K Monitor',
    description: 'Ultra HD monitor with HDMI and DisplayPort',
    price: 329.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stockQuantity: 25,
    categoryName: 'Monitors',
    createdAt: '2025-05-10T12:00:00Z',
    updatedAt: '2025-07-01T12:00:00Z',
    deletedAt: null,
    isDeleted: false
  },
  {
    name: 'Gaming Headset',
    description: 'Surround sound gaming headset with microphone',
    price: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stockQuantity: 75,
    categoryName: 'Audio',
    createdAt: '2025-04-15T16:30:00Z',
    updatedAt: '2025-06-25T13:00:00Z',
    deletedAt: null,
    isDeleted: false
  },
  {
    name: 'USB-C Charging Cable',
    description: 'Durable USB-C to USB-A charging cable, 1.5m',
    price: 9.99,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=799&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    stockQuantity: 300,
    categoryName: 'Cables',
    createdAt: '2025-07-10T11:00:00Z',
    updatedAt: '2025-07-20T11:00:00Z',
    deletedAt: null,
    isDeleted: false
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
  products: Product[] = [];
  isLoading = true;

  searchKeyword: string = '';
  suggestions: string[] = [];
  private searchTerms = new Subject<string>();

  selectedCategory: string = '';
  categories: string[] = [];

  minPrice!: number;
  maxPrice!: number;

  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;
  sortBy: string = '';
  sortDirection: string = '';

  loadSortedProducts() {
    this.isLoading = true;
    this.productService
      .getAllProductsSorted(
        this.sortBy,
        this.sortDirection,
        this.currentPage,
        this.pageSize
      )
      .subscribe({
        next: (response) => {
          this.products = response.content;
          this.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        },
      });
  }

  changeSort(sortBy: string, sortDirection: string) {
    this.sortBy = sortBy;
    this.sortDirection = sortDirection;
    this.currentPage = 0; // reset page when sorting changes
    this.loadSortedProducts();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.loadSortedProducts();
  }

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetchProducts();
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
      this.products = PRODUCTS; 
      this.isLoading = false;
  }

  loadCategories() {
    this.productService.getAllCategories().subscribe({
      next: (cats) => {
        this.categories = cats.map((cat) => cat.name);
      },
      error: (err) => console.error(err),
    });
  }

  fetchProducts(page: number = 0) {
    this.isLoading = true;
    this.productService.getAllProductsPaginated(page, this.pageSize).subscribe({
      next: (response) => {
        this.products = response.content;
        this.totalPages = response.totalPages;
        this.currentPage = response.pageNumber;
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
      this.fetchProducts(); // reload all products if search input is empty
    }
  }

  selectSuggestion(suggestion: string): void {
    this.searchKeyword = suggestion;
    this.suggestions = [];
    this.search();
  }

  search(): void {
    this.isLoading = true;
    this.productService.searchProducts(this.searchKeyword).subscribe({
      next: (data) => {
        this.products = data.content; // ⬅️ تعديل: استخدام content من PaginatedResponseDto
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  filterByCategory() {
    if (this.selectedCategory === '') {
      this.fetchProducts(); // load all products if no category selected
    } else {
      this.isLoading = true;
      this.productService
        .getProductsByCategory(this.selectedCategory)
        .subscribe({
          next: (data) => {
            this.products = data.content; // ⬅️ تعديل: استخدام content من PaginatedResponseDto
            this.isLoading = false;
          },
          error: (err) => {
            console.error(err);
            this.isLoading = false;
          },
        });
    }
  }

  filterByPriceRange() {
    if (this.minPrice == null && this.maxPrice == null) {
      this.fetchProducts(); // load all products if price range not set
    } else {
      this.isLoading = true;
      this.productService
        .getProductsByPriceRange(this.minPrice, this.maxPrice)
        .subscribe({
          next: (data) => {
            this.products = data.content; // ⬅️ تعديل: استخدام content من PaginatedResponseDto
            this.isLoading = false;
          },
          error: (err) => {
            console.error(err);
            this.isLoading = false;
          },
        });
    }
  }
}
