import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StoreProductResponse } from '../models/store-product-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrlProduct = 'http://localhost:8081/product';
  private apiUrlCategory = 'http://localhost:8081/category';

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
    }>(`${this.apiUrlProduct}`, { params });
  }

  getSuggestions(partial: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrlProduct}/suggestions`, {
      params: { partial },
    });
  }

  searchProducts(
    keyword: string,
    page: number = 0,
    size: number = 10
  ): Observable<{
    content: StoreProductResponse[];
    totalPages: number;
    totalElements: number;
    number: number;
  }> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page)
      .set('size', size);

    return this.http.get<{
      content: StoreProductResponse[];
      totalPages: number;
      totalElements: number;
      number: number;
    }>(`${this.apiUrlProduct}`, { params });
  }

  getProductsByCategory(
    categoryName: string,
    page: number = 0,
    size: number = 10
  ): Observable<{
    content: StoreProductResponse[];
    totalPages: number;
    totalElements: number;
    number: number;
  }> {
    const params = new HttpParams()
      .set('categoryName', categoryName)
      .set('page', page)
      .set('size', size);

    return this.http.get<{
      content: StoreProductResponse[];
      totalPages: number;
      totalElements: number;
      number: number;
    }>(`${this.apiUrlProduct}`, { params });
  }

  getProductsByPriceRange(
    min: number,
    max: number,
    page: number = 0,
    size: number = 10
  ): Observable<{
    content: StoreProductResponse[];
    totalPages: number;
    totalElements: number;
    number: number;
  }> {
    const params = new HttpParams()
      .set('minPrice', min)
      .set('maxPrice', max)
      .set('page', page)
      .set('size', size);

    return this.http.get<{
      content: StoreProductResponse[];
      totalPages: number;
      totalElements: number;
      number: number;
    }>(`${this.apiUrlProduct}`, { params });
  }

  getAllProductsSorted(
    sortBy: string,
    sortDirection: string,
    page: number = 0,
    size: number = 10
  ): Observable<{
    content: StoreProductResponse[];
    totalPages: number;
    totalElements: number;
    number: number;
  }> {
    const params = new HttpParams()
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection)
      .set('page', page)
      .set('size', size);

    return this.http.get<{
      content: StoreProductResponse[];
      totalPages: number;
      totalElements: number;
      number: number;
    }>(`${this.apiUrlProduct}`, { params });
  }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlCategory}`);
  }
}
