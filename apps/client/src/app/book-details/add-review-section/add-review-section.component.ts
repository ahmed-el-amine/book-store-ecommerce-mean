import { Component ,Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-review-section',
  imports: [CommonModule],
  templateUrl: './add-review-section.component.html',
  styleUrl: './add-review-section.component.css',
})
export class AddReviewSectionComponent {
  @Input() bookId: string | undefined;
  ngOnInit(): void {
    console.log(this.bookId);
  }
}
