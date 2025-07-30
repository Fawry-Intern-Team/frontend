import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Stock } from '../models/stock.model';
import { StockHistory } from '../models/stock-history.model';

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
        return this.http.get<Stock[]>(`${this.apiUrl}/stock?storeId=${storeId}`, { withCredentials: true })
            .pipe(catchError(this.handleError));
    }

    getStockHistory(storeId: string, productId?: string): Observable<StockHistory[]> {
        return this.http.get<StockHistory[]>(`${this.apiUrl}/${storeId}/history`, { withCredentials: true })
            .pipe(
                map(history => productId ? history.filter(h => h.productId === productId) : history),
                catchError(this.handleError)
            );
    }

    addStock(stockOperation: StockOperation, availableQuantity?: number): Observable<any> {
        if (!this.validateStockOperation(stockOperation)) {
            return throwError(() => new Error('Invalid stock operation data'));
        }

        if (stockOperation.quantity <= 0) {
            return throwError(() => new Error('Quantity must be greater than 0'));
        }
        
        if (availableQuantity !== undefined && stockOperation.quantity > availableQuantity) {
            return throwError(() => new Error(`Cannot add ${stockOperation.quantity} units. Only ${availableQuantity} available.`));
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
            // Client-side error
            errorMessage = error.error.message;
        } else {
            // Server-side error
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