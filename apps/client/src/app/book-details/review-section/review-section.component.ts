import { Component ,Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-section',
  imports: [CommonModule],
  templateUrl: './review-section.component.html',
  styleUrl: './review-section.component.css',
})
export class ReviewSectionComponent {
  @Input() bookId: string | undefined;
  ngOnInit(): void {
    console.log(this.bookId);
  }
}
