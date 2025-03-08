import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';  // الاستيراد هن
import { ReviewService } from '../../service/reviews/review.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';  // استيراد الـ Forms


@Component({
  selector: 'app-add-review-section',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-review-section.component.html',
  styleUrl: './add-review-section.component.css',
})
export class AddReviewSectionComponent {
  @Input() bookId: string | undefined;
  commentForm: FormGroup;  // تعريف الفورم
  submittedSuccessfully = false;
  errorOccurred = false;

  constructor(private reviewService: ReviewService) {
    this.commentForm = new FormGroup({
      comment: new FormControl('', [Validators.required, Validators.minLength(30), Validators.maxLength(500)]),  // الـ Validators
      rating: new FormControl('', Validators.required)
    });
  }

  // دالة لإرسال الكومنت
  onSubmit() {
    if (this.commentForm.valid && this.bookId) {
      const comment = this.commentForm.value.comment;
      const rating = this.commentForm.value.rating;

      this.reviewService.addReview(this.bookId, comment, rating).subscribe({
        next: (response) => {
          console.log('done', response);
          this.submittedSuccessfully = true;
          this.errorOccurred = false;
        },
        error: (err) => {
          console.error('something wrong happend', err);
          this.submittedSuccessfully = false;
          this.errorOccurred = true;
        }
      });
    } else {
      console.log('unvalid form');
    }
  }

  get formControl() {
    return this.commentForm.controls

  }

}
