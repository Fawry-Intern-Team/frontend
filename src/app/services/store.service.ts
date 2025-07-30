import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Store } from '../models/store.model';
import { PageRequest, PageResponse } from '../models/pagination.model';

@Injectable({
    providedIn: 'root',
})
export class StoreService {
    private apiUrl = 'http://localhost:8080/api/store';

    constructor(private http: HttpClient) {}

    getStores(): Observable<Store[]> {
        return this.http.get<Store[]>(this.apiUrl, { withCredentials: true })
            .pipe(
                map(stores => stores.map(store => ({
                    ...store,
                    location: this.capitalizeLocation(store.location)
                }))),
                catchError(this.handleError)
            );
    }

    getStoresPaginated(pageRequest: PageRequest): Observable<PageResponse<Store>> {
        let params = new HttpParams()
            .set('paginated', 'true')
            .set('page', (pageRequest.page || 0).toString())
            .set('size', (pageRequest.size || 10).toString())
            .set('sortBy', pageRequest.sortBy || 'location')
            .set('sortDirection', pageRequest.sortDirection || 'asc');

        return this.http.get<PageResponse<Store>>(this.apiUrl, { 
            params, 
            withCredentials: true 
        }).pipe(
            map(page => ({
                ...page,
                content: page.content.map(store => ({
                    ...store,
                    location: this.capitalizeLocation(store.location)
                }))
            })),
            catchError(this.handleError)
        );
    }

    createStore(store: { location: string }): Observable<Store> {
        if (!store.location?.trim()) {
            return throwError(() => new Error('Store location is required'));
        }

        return this.http.post<Store>(`${this.apiUrl}/create`, store, { withCredentials: true })
            .pipe(catchError(this.handleError));
    }

    findStoreByLocation(stores: Store[], searchKeyword: string): Store | null {
        if (!searchKeyword?.trim()) {
            return null;
        }

        return stores.find(store =>
            store.location.toLowerCase().includes(searchKeyword.toLowerCase())
        ) || null;
    }

    getStoreLocationById(stores: Store[], storeId: string): string {
        const store = stores.find(s => s.id === storeId);
        return store?.location || 'Unknown Store';
    }

    private capitalizeLocation(location: string): string {
        return location.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred';
        
        if (error.error instanceof ErrorEvent) {
            errorMessage = error.error.message;
        } else {
            if (error.status === 400 && error.error?.message) {
                errorMessage = error.error.message;
            } else if (error.status === 404) {
                errorMessage = 'Store not found';
            } else if (error.status === 500) {
                errorMessage = 'Server error occurred';
            }
        }
        
        return throwError(() => new Error(errorMessage));
    }
}