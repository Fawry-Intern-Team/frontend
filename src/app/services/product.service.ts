import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { StoreProductResponse } from '../models/store-product-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrlProduct = 'http://localhost:8080/product';
  private apiUrlCategory = 'http://localhost:8080/category';

  constructor(private http: HttpClient) {}

  getAllProducts(
    page: number = 0,
    size: number = 10
  ): Observable<{
    content: StoreProductResponse[];
    totalPages: number;
    totalElements: number;
    number: number;
  }> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<{
      content: StoreProductResponse[];
      totalPages: number;
      totalElements: number;
      number: number;
    }>(`${this.apiUrlProduct}`, { params, withCredentials: true });
  }

  getSuggestions(partial: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrlProduct}/suggestions`, {
      params: { partial }, withCredentials: true,
    });
  }

  searchProductsFiltered(filters: {
    keyword?: string;
    category?: string;
    min?: number;
    max?: number;
    sortBy?: string;
    sortDirection?: string;
    page?: number;
    size?: number;
  }): Observable<{
    content: StoreProductResponse[];
    totalPages: number;
    totalElements: number;
    number: number;
  }> {
    let params = new HttpParams();

    if (filters.keyword) {
      params = params.set('keyword', filters.keyword);
    }

    if (filters.category) {
      params = params.set('category', filters.category);
    }

    if (filters.min != null) {
      params = params.set('min', filters.min.toString());
    }

    if (filters.max != null) {
      params = params.set('max', filters.max.toString());
    }

    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }

    if (filters.sortDirection) {
      params = params.set('sortDirection', filters.sortDirection);
    }

    params = params
      .set('page', (filters.page ?? 0).toString())
      .set('size', (filters.size ?? 10).toString());
    console.log(filters.sortBy + " " + filters.keyword);
    return this.http.get<{
      content: StoreProductResponse[];
      totalPages: number;
      totalElements: number;
      number: number;
    }>(`${this.apiUrlProduct}/search`, { params , withCredentials: true});
  }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlCategory}`, { withCredentials: true });
  }
}
