import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../service/reviews/review.service';
import {  Review } from './review-interface';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-review-section',
  imports: [CommonModule, FormsModule ],
  templateUrl: './review-section.component.html',
  styleUrl: './review-section.component.css',
})



export class ReviewSectionComponent {
  @Input() bookId: string | undefined;
  reviews: Review[] = [];
  userData: any;
  isAuthenticated = false;
  status = "data"
  reviewId: string | undefined;

  constructor(private reviewService: ReviewService, private authService: AuthService) {

  }
  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
      if (this.isAuthenticated) {
        this.authService.currentUser$.subscribe({
          next: (user) => {
            this.userData = user;
          },
          error: (err) => {
            console.error('Error fetching user data', err);
          }
        });
      }
    });
    if (this.bookId) {
      this.reviewService.getAllBookReview(this.bookId).subscribe({
        next: (data: Review[]) => {
          this.reviews = data;
          this.reviewService.loadReviews(data);

        },
        error: (error) => {
          console.error('Error fetching book:', error);
        },
        complete: () => {
          console.log('Complete!');
        }
      });
    }
    else {
      console.error('Book ID is undefined');
    }
    this.reviewService.reviews$.subscribe((reviews) => {
      this.reviews = reviews;
    });
  }


  getStars(rating: number): string {
    const fullStars = '★'.repeat(rating); 
    const emptyStars = '☆'.repeat(5 - rating);
    return fullStars + emptyStars; 
  }
  editComment(id: string) {
    this.status = 'update'
    this.reviewId = id


  }
  saveReview(newComment:Review): void {
    console.log(newComment)

      const index = this.reviews.findIndex((review) => review.id === newComment.id);
    if (index !== -1) {
        console.log(newComment)
        this.reviews[index] = newComment;
      }

    this.status = 'data';
    this.reviewId = undefined;
    this.reviewService.updateReview(newComment.id, newComment.comment, newComment.rating).subscribe({
      next: (updateReview: Review) => {
        console.log('Review updated successfully:', updateReview);
      },
      error: (error) => {
        console.error('Error updating review:', error);
      },
    });
  }
  deleteComment(id: string) {
    this.reviewService.deleteReview(id,).subscribe({
      next: (data: any) => {
        console.log(data)
      },
      error: (error) => {
        console.error('Error fetching book:', error);
      },
      complete: () => {
        console.log('Complete!');
      }
    })

  }

}
