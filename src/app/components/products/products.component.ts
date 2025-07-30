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

  minPrice: number | null = null;
  maxPrice: number | null = null;

  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;
  sortBy: string = '';
  sortDirection: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
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
