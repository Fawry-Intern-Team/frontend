import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { StoreProductResponse } from '../../models/store-product-response.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProductCardComponent } from '../product-card/product-card.component';
import { SliderModule } from 'primeng/slider';

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

  minPrice!: number;
  maxPrice!: number;

  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;
  sortBy: string = '';
  sortDirection: string = '';

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
  }

  fetchProducts(page: number = 0) {
    this.isLoading = true;
    this.productService.getAllProducts(page, this.pageSize).subscribe({
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

  loadCategories() {
    this.productService.getAllCategories().subscribe({
      next: (cats) => {
        this.categories = cats.map((cat) => cat.name);
      },
      error: (err) => console.error(err),
    });
  }

  onSearchChange(term: any): void {
    const value = typeof term === 'string' ? term : term.target.value;
    if (value.length >= 1) {
      this.searchTerms.next(value);
    } else {
      this.suggestions = [];
      this.fetchProducts();
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
        this.products = data.content;
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
      this.fetchProducts();
    } else {
      this.isLoading = true;
      this.productService
        .getProductsByCategory(this.selectedCategory)
        .subscribe({
          next: (data) => {
            this.products = data.content;
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
      this.fetchProducts();
    } else {
      this.isLoading = true;
      this.productService
        .getProductsByPriceRange(this.minPrice, this.maxPrice)
        .subscribe({
          next: (data) => {
            this.products = data.content;
            this.isLoading = false;
          },
          error: (err) => {
            console.error(err);
            this.isLoading = false;
          },
        });
    }
  }

  loadSortedProducts() {
    this.isLoading = true;
    this.productService
      .getAllProductsSorted(this.sortBy, this.sortDirection)
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

  changeSort(sortBy: string, sortDirection: string) {
    this.sortBy = sortBy;
    this.sortDirection = sortDirection;
    this.currentPage = 0;
    this.loadSortedProducts();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.fetchProducts(page);
  }
}
