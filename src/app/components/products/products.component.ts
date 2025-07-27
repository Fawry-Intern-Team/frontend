import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
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
