import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Stock } from '../models/stock.model';
import { StockHistory } from '../models/stock-history.model';
import { PageRequest, PageResponse } from '../models/pagination.model';

export interface StockOperation {
    
    storeId: string;
    productId: string;
    quantity: number;
    reason?: string;
}

export interface StockStatus {
    status: string;
    statusClass: string;
}

@Injectable({
    providedIn: 'root',
})
export class StockService {
    private apiUrl = 'http://localhost:8080/api/store';

    constructor(private http: HttpClient) {}

    getStocksByStoreId(storeId: string): Observable<Stock[]> {
        const params = new HttpParams().set('storeId', storeId);
        return this.http.get<Stock[]>(`${this.apiUrl}/stock`, { 
            params, 
            withCredentials: true 
        }).pipe(catchError(this.handleError));
    }

    getStocksByStoreIdPaginated(storeId: string, pageRequest: PageRequest): Observable<PageResponse<Stock>> {
        let params = new HttpParams()
            .set('storeId', storeId)
            .set('paginated', 'true')
            .set('page', (pageRequest.page || 0).toString())
            .set('size', (pageRequest.size || 10).toString())
            .set('sortBy', pageRequest.sortBy || 'productId')
            .set('sortDirection', pageRequest.sortDirection || 'asc');

        return this.http.get<PageResponse<Stock>>(`${this.apiUrl}/stock`, { 
            params, 
            withCredentials: true 
        }).pipe(catchError(this.handleError));
    }

    getStockHistory(storeId: string, productId?: string): Observable<StockHistory[]> {
        return this.http.get<StockHistory[]>(`${this.apiUrl}/${storeId}/history`, { withCredentials: true })
            .pipe(
                map(history => productId ? history.filter(h => h.productId === productId) : history),
                catchError(this.handleError)
            );
    }

    getStockHistoryPaginated(storeId: string, pageRequest: PageRequest, productId?: string): Observable<PageResponse<StockHistory>> {
        let params = new HttpParams()
            .set('paginated', 'true')
            .set('page', (pageRequest.page || 0).toString())
            .set('size', (pageRequest.size || 10).toString())
            .set('sortBy', pageRequest.sortBy || 'timestamp')
            .set('sortDirection', pageRequest.sortDirection || 'desc');

        return this.http.get<PageResponse<StockHistory>>(`${this.apiUrl}/${storeId}/history`, { 
            params, 
            withCredentials: true 
        }).pipe(
            map(page => productId ? {
                ...page,
                content: page.content.filter(h => h.productId === productId)
            } : page),
            catchError(this.handleError)
        );
    }

    addStock(stockOperation: StockOperation): Observable<any> {
        if (!this.validateStockOperation(stockOperation)) {
            return throwError(() => new Error('Invalid stock operation data'));
        }

        if (stockOperation.quantity <= 0) {
            return throwError(() => new Error('Quantity must be greater than 0'));
        }

        const stockDto = {
            ...stockOperation,
            reason: stockOperation.reason || 'Stock addition'
        };

        return this.http.post(`${this.apiUrl}/stock/add`, stockDto, { withCredentials: true })
            .pipe(catchError(this.handleError));
    }

    consumeStock(stockOperation: StockOperation, availableQuantity?: number): Observable<any> {
        if (!this.validateStockOperation(stockOperation)) {
            return throwError(() => new Error('Invalid stock operation data'));
        }

        if (stockOperation.quantity <= 0) {
            return throwError(() => new Error('Quantity must be greater than 0'));
        }

        if (availableQuantity !== undefined && stockOperation.quantity > availableQuantity) {
            return throwError(() => new Error(`Cannot consume ${stockOperation.quantity} units. Only ${availableQuantity} available.`));
        }

        const stockDto = {
            ...stockOperation,
            reason: stockOperation.reason || 'Stock consumption'
        };

        return this.http.post(`${this.apiUrl}/stock/consume`, stockDto, { withCredentials: true })
            .pipe(catchError(this.handleError));
    }

    createStock(stockOperation: StockOperation): Observable<any> {
        if (!this.validateStockOperation(stockOperation)) {
            return throwError(() => new Error('Invalid stock operation data'));
        }

        if (stockOperation.quantity < 0) {
            return throwError(() => new Error('Initial quantity cannot be negative'));
        }

        const stockDto = {
            ...stockOperation,
            reason: stockOperation.reason || 'Initial stock creation'
        };

        return this.http.post(`${this.apiUrl}/stock/create`, stockDto, { withCredentials: true })
            .pipe(catchError(this.handleError));
    }

    // Helper methods for stock status
    getStockStatus(quantity: number): StockStatus {
        if (quantity === 0) {
            return {
                status: 'Out of Stock',
                statusClass: 'status-badge status-out-of-stock'
            };
        }
        if (quantity < 10) {
            return {
                status: 'Low Stock',
                statusClass: 'status-badge status-low-stock'
            };
        }
        return {
            status: 'In Stock',
            statusClass: 'status-badge status-in-stock'
        };
    }

    // Helper methods for stock history display
    formatDateTime(dateTimeString: string): string {
        const date = new Date(dateTimeString);
        return date.toLocaleString();
    }

    getQuantityChangeClass(quantityChange: number): string {
        if (quantityChange > 0) return 'text-green-600 font-semibold';
        if (quantityChange < 0) return 'text-red-600 font-semibold';
        return 'text-gray-600';
    }

    getQuantityChangeIcon(quantityChange: number): string {
        if (quantityChange > 0) return 'pi pi-arrow-up';
        if (quantityChange < 0) return 'pi pi-arrow-down';
        return 'pi pi-minus';
    }

    private validateStockOperation(operation: StockOperation): boolean {
        return !!(operation.storeId?.trim() && 
                 operation.productId?.trim() && 
                 operation.quantity !== undefined && 
                 operation.quantity !== null);
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred';
        
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else {
            if (error.status === 400) {
                if (error.error?.message?.includes('Not enough stock')) {
                    errorMessage = 'Not enough stock available for consumption';
                } else if (error.error?.message?.includes('already created')) {
                    errorMessage = 'Stock already exists for this store and product combination';
                } else if (error.error?.message) {
                    errorMessage = error.error.message;
                } else {
                    errorMessage = 'Invalid request';
                }
            } else if (error.status === 404) {
                errorMessage = 'Stock not found. Please create the stock first.';
            } else if (error.status === 500) {
                errorMessage = 'Server error occurred';
            }
        }
        
        return throwError(() => new Error(errorMessage));
    }
}