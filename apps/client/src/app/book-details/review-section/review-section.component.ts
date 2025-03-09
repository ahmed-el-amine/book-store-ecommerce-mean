import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../service/reviews/review.service';

@Component({
  selector: 'app-review-section',
  imports: [CommonModule],
  templateUrl: './review-section.component.html',
  styleUrl: './review-section.component.css',
})
export class ReviewSectionComponent {
  @Input() bookId: string | undefined;
  reviews: any[] = [];

  constructor(private reviewService: ReviewService) {

  }
  ngOnInit(): void {
    if (this.bookId) {
      this.reviewService.getAllBookReview(this.bookId).subscribe({
        next: (data) => {
          this.reviews = data;
          console.log("hiiiiii", this.reviews);
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

  }
}
