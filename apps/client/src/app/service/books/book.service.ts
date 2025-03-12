import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs';
import { Book } from '../../interfaces/BookDetails';
import { BookEssential } from '../../interfaces/BookEssential';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  apiUrl = `${environment.apiUrlV1}/books`;

  constructor(private http: HttpClient) {}

  getBooksEssential(): Observable<BookEssential[]> {
    return this.http.get<BookEssential[]>(this.apiUrl, { withCredentials: true }).pipe(catchError(this.handleError));
  }

  getBooksDetails(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl, { withCredentials: true }).pipe(catchError(this.handleError));
  }

  getBookById(id: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(catchError(this.handleError));
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book, { withCredentials: true }).pipe(catchError(this.handleError));
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book, { withCredentials: true }).pipe(catchError(this.handleError));
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(catchError(this.handleError));
  }
  getBooks(filters: { categories?: string; title?: string; price?: number; rating?: number }): Observable<BookEssential[]> {
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
    return this.http.get<BookEssential[]>(this.apiUrl, { params, withCredentials: true }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.log('Server Error', error);
    return throwError(() => new Error('There was a problem with the server.please try again'));
  }
}
