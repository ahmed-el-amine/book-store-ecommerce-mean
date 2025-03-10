import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { ReviewResponse, Review } from '../../book-details/review-section/review-interface';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private reviewsSubject = new BehaviorSubject<Review[]>([]);
  reviews$ = this.reviewsSubject.asObservable();



  constructor(private http: HttpClient) { }



  loadReviews(initialReviews: Review[]) {
    this.reviewsSubject.next(initialReviews);
  }




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
  addNewReview(newReview: Review) {
    const currentReviews = this.reviewsSubject.value;

    const updatedReviews = [...currentReviews, newReview];

    this.reviewsSubject.next(updatedReviews);
  }
  updateReview(reviewId: string, comment?: string, rating?: number): Observable<any> {
    const body = {
      comment: comment,
      rating: rating
    };
    return this.http.patch(`http://localhost:3000/api/v1/reviews/${reviewId}`, body, { withCredentials: true });
  }

  deleteReview(reviewId: string): Observable<any> {

    return this.http.delete(`http://localhost:3000/api/v1/reviews/${reviewId}`, { withCredentials: true }).pipe(
      tap(() => {
        const currentReviews = this.reviewsSubject.value;
        const updatedReviews = currentReviews.filter(review => review.id !== reviewId);
        this.reviewsSubject.next(updatedReviews); // تحديث المراجعات بعد الحذف
      })
    );
    
  };
}