import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '../models/store.model'; // use correct path

@Injectable({
    providedIn: 'root',
})
export class StoreService {
    private apiUrl = 'http://localhost:8087/api/store';

    constructor(private http: HttpClient) {}

    getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(this.apiUrl);
    }

    createStore(store: Store): Observable<Store> {
    return this.http.post<Store>(`${this.apiUrl}/create`, store);
    } 
}