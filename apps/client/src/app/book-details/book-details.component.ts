import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookSectionComponent } from './book-section/book-section.component';
import { ReviewSectionComponent } from './review-section/review-section.component';
import { AddReviewSectionComponent } from './add-review-section/add-review-section.component';

@Component({
  selector: 'app-book-details',
  imports: [CommonModule, BookSectionComponent, ReviewSectionComponent, AddReviewSectionComponent],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css',
})
export class BookDetailsComponent {
  @Input() id: string | undefined;
  


}
