import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookServiceService {

  private baseURL = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) { }

  getBookById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/books/${id}`, { withCredentials: true });
  }

  getBooks(filters: { categories?: string, title?: string, price?: number, rating?: number }): Observable<any> {
    let params = new HttpParams();

    if (filters.categories) {
      params = params.append('categories', filters.categories);
    }
    if (filters.title) {
      params = params.append('title', filters.title);
    }
    if (filters.price) {
      params = params.append('price', filters.price.toString());
    }
    if (filters.rating) {
      params = params.append('rating', filters.rating.toString());
    }

    return this.http.get<any>(`${this.baseURL}/books/`, { params, withCredentials: true });
  }
}
