import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }
  getAllBookReview(id: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/v1/reviews/${id}`, { withCredentials: true });
  }
  addReview(bookId: string, comment: string, rating: string): Observable<any> {
    const body = {
      bookId: bookId,
      comment: comment,
      rating: rating
    };
    return this.http.post('http://localhost:3000/api/v1/reviews', body, { withCredentials: true });
  }
 //update and delete

}
