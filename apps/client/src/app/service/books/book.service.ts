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
  private apiUrl = environment.apiUrlV1 + '/books';

  constructor(private http: HttpClient) {}

  getBooksEssential(): Observable<BookEssential[]> {
    return this.http.get<BookEssential[]>(this.apiUrl, { withCredentials: true }).pipe(catchError(this.handleError));
  }

  getBooksDetails(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl, { withCredentials: true }).pipe(catchError(this.handleError));
  }

  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(catchError(this.handleError));
  }

  addBook(book: FormData): Observable<any> {
    return this.http.post<Book>(`${this.apiUrl}/add`, book, { withCredentials: true }).pipe(catchError(this.handleError));
  }

  updateBook(id: string, book: FormData): Observable<any> {
    return this.http.patch<Book>(`${this.apiUrl}/${id}`, book, { withCredentials: true }).pipe(catchError(this.handleError));
  }

  deleteBook(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(catchError(this.handleError));
  }

  getBooks(filters: any = {}, page = 1, limit = 6): Observable<any> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    // Add filters to params if they exist
    if (filters.title) params = params.set('title', filters.title);
    if (filters.categories) params = params.set('categories', filters.categories);
    if (filters.price) params = params.set('price', filters.price);
    if (filters.rating) params = params.set('rating', filters.rating);
    if (filters.sort) params = params.set('sort', filters.sort);

    return this.http.get<any>(this.apiUrl, { params });
  }

  private handleError(error: HttpErrorResponse) {
    console.log('Server Error', error);
    return throwError(() => new Error('There was a problem with the server.please try again'));
  }
}
