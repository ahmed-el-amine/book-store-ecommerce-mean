import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../service/reviews/review.service';
import {  Review } from './review-interface';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-review-section',
  imports: [CommonModule],
  templateUrl: './review-section.component.html',
  styleUrl: './review-section.component.css',
})



export class ReviewSectionComponent {
  @Input() bookId: string | undefined;
  reviews: Review[] = [];
  userData: any;
  isAuthenticated = false;
  constructor(private reviewService: ReviewService, private authService: AuthService) {

  }
  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
      if (this.isAuthenticated) {
        this.authService.currentUser$.subscribe({
          next: (user) => {
            console.log('User Data:', user);
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
          console.log("review", this.reviews);
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
    const fullStars = '★'.repeat(rating); // نجوم ممتلئة
    const emptyStars = '☆'.repeat(5 - rating); // نجوم فارغة
    return fullStars + emptyStars; // إرجاع النجوم الممتلئة والفارغة
  }
  editComment(id: string) {
    // this.reviewService.updateReview(id,).subscribe((response) => {
    //   next:
    // })
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
