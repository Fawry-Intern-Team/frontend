import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;
  searchKeyword: string = '';
  suggestions: string[] = [];
  private searchTerms = new Subject<string>();

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetchProducts();

    // suggestions observable
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

  fetchProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
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
    this.productService.searchProducts(this.searchKeyword).subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error(err),
    });
  }
}
