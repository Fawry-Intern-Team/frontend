import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8081/product'; // ✅ endpoint الصحيح

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}`); // ✅ راجع ال path الصحيح في الباك اند
  }

  searchProducts(keyword: string): Observable<Product[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Product[]>(`${this.apiUrl}/search`, { params });
  }

  getSuggestions(partial: string) {
    return this.http.get<string[]>(`${this.apiUrl}/suggestions`, {
      params: { partial },
    });
  }

  getProductsByCategory(categoryName: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `/api/product/category?categoryName=${categoryName}`
    );
  }

  getProductsByPriceRange(min: number, max: number): Observable<Product[]> {
    return this.http.get<Product[]>(
      `/api/product/price?minPrice=${min}&maxPrice=${max}`
    );
  }
}
