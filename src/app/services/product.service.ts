import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

interface PaginatedResponseDto<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrlProduct = 'http://localhost:8081/product';
  private apiUrlCategory = 'http://localhost:8081/category';

  constructor(private http: HttpClient) {}


  getAllProductsPaginated(
    page: number,
    size: number
  ): Observable<PaginatedResponseDto<Product>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PaginatedResponseDto<Product>>(
      `${this.apiUrlProduct}`,
      { params }
    );
  }

  searchProducts(keyword: string): Observable<PaginatedResponseDto<Product>> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<PaginatedResponseDto<Product>>(
      `${this.apiUrlProduct}/search`,
      { params }
    );
  }

  getSuggestions(partial: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrlProduct}/suggestions`, {
      params: { partial },
    });
  }

  getProductsByCategory(
    categoryName: string
  ): Observable<PaginatedResponseDto<Product>> {
    const params = new HttpParams().set('categoryName', categoryName);
    return this.http.get<PaginatedResponseDto<Product>>(
      `${this.apiUrlProduct}/category`,
      {
        params,
      }
    );
  }

  getProductsByPriceRange(
    min: number,
    max: number
  ): Observable<PaginatedResponseDto<Product>> {
    const params = new HttpParams().set('minPrice', min).set('maxPrice', max);
    return this.http.get<PaginatedResponseDto<Product>>(
      `${this.apiUrlProduct}/price`,
      {
        params,
      }
    );
  }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlCategory}`);
  }
}
