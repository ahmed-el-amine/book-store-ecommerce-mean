import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ReviewService } from '../../service/reviews/review.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Review } from '../review-section/review-interface';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';




@Component({
  selector: 'app-add-review-section',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-review-section.component.html',
  styleUrl: './add-review-section.component.css',
})
export class AddReviewSectionComponent {
  @Input() bookId: string | undefined;
  commentForm: FormGroup;
  submittedSuccessfully = false;
  errorOccurred = false;
  reviews: Review[] = [];
  userData: any;
  isAuthenticated = false;

  constructor(private reviewService: ReviewService, private authService: AuthService
  ) {
    this.commentForm = new FormGroup({
      comment: new FormControl('', [Validators.required, Validators.minLength(30), Validators.maxLength(500)]),
      rating: new FormControl('', Validators.required)
    });
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
  }
  onSubmit() {

    if (this.commentForm.valid && this.bookId) {
      const comment = this.commentForm.value.comment;
      const rating = Number(this.commentForm.value.rating);
      this.reviewService.addReview(this.bookId, comment, rating).subscribe({
        next: (response) => {
          const newReview: Review = response.review;
          console.log('done', newReview);
          this.reviewService.addNewReview(newReview); // 
          console.log('done', response);
          this.submittedSuccessfully = true;
          this.errorOccurred = false;
          this.commentForm.reset();
        },
        error: (err) => {
          console.error('something wrong happend', err);
          this.submittedSuccessfully = false;
          this.errorOccurred = true;
        }
      });
    } else {
      console.log('invalid form');
    }
  }


  get formControl() {
    return this.commentForm.controls

  }
}
