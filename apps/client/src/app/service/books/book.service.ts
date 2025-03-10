import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../../shared/book-card/book.interface';

@Injectable({
  providedIn: 'root'
})
export class BookServiceService {

  constructor(private http: HttpClient) { }
  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`http://localhost:3000/api/v1/books/${id}`);
  }
  addBook(bookData:Partial<Book>,file:File):Observable<Book>{

    const formData= new FormData();

    for(const key in bookData)
    formData.append('cover',file)
    return this.http.post<Book>(`http://localhost:3000/api/v1/books/add`,formData);
  }
}

