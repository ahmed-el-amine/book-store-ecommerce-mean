import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ReviewResponse, Review } from '../../book-details/review-section/review-interface';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }

  getAllBookReview(id: string): Observable<Review[]> {
    return this.http.get<ReviewResponse>(`http://localhost:3000/api/v1/reviews/${id}`, { withCredentials: true }).pipe(
      map((data: ReviewResponse) => {
        return data.reviewList; // إرجاع الـ reviewList فقط
      })
    );
  };

  addReview(bookId: string, comment: string, rating: number): Observable<any> {
    const body = {
      bookId: bookId,
      comment: comment,
      rating: rating
    };
    return this.http.post('http://localhost:3000/api/v1/reviews', body, { withCredentials: true });
  }
  updateReview(reviewId: string, comment?: string, rating?: number): Observable<any> {
    const body = {
      comment: comment,
      rating: rating
    };
    return this.http.patch(`http://localhost:3000/api/v1/reviews/${reviewId}`, body, { withCredentials: true });
  }

  deleteReview(reviewId: string): Observable<any> {

    return this.http.delete(`http://localhost:3000/api/v1/reviews/${reviewId}`, { withCredentials: true });

  };
}