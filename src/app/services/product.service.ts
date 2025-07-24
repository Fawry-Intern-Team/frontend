import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrlProduct = 'http://localhost:8081/product';
  private apiUrlCategory = 'http://localhost:8081/category';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrlProduct}`);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Product[]>(`${this.apiUrlProduct}/search`, { params });
  }

  getSuggestions(partial: string) {
    return this.http.get<string[]>(`${this.apiUrlProduct}/suggestions`, {
      params: { partial },
    });
  }

  getProductsByCategory(categoryName: string): Observable<Product[]> {
    const params = new HttpParams().set('categoryName', categoryName);
    return this.http.get<Product[]>(`${this.apiUrlProduct}/category`, {
      params,
    });
  }

  getProductsByPriceRange(min: number, max: number): Observable<Product[]> {
    const params = new HttpParams().set('minPrice', min).set('maxPrice', max);

    return this.http.get<Product[]>(`${this.apiUrlProduct}/price`, {
      params,
    });
  }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlCategory}`);
  }
}
