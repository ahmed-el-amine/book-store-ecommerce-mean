import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../service/books/book.service';

@Component({
  selector: 'app-book-section',
  imports: [CommonModule],
  templateUrl: './book-section.component.html',
  styleUrl: './book-section.component.css',
})
export class BookSectionComponent implements OnInit {
  @Input() bookId: string | undefined;
  book: any = null;

  showCategoryCollapse = false;
  showAuthorCollapse = false;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    if (this.bookId) {
      this.bookService.getBookById(this.bookId).subscribe({
        next: (data) => {
          this.book = data;
          console.log('data', data);
          console.log('book', this.book);
        },
        error: (error) => {
          console.error('Error fetching book:', error);
        },
        complete: () => {
          console.log('Complete!');
        },
      });
    } else {
      console.error('Book ID is undefined');
    }
  }

  toggleCategoryCollapse() {
    this.showCategoryCollapse = !this.showCategoryCollapse;
    // Remove the code that closes the other section
  }

  toggleAuthorCollapse() {
    this.showAuthorCollapse = !this.showAuthorCollapse;
    // Remove the code that closes the other section
  }

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    let stars = '';
    stars += '<i class="fas fa-star"></i>'.repeat(fullStars);
    if (halfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    }
    stars += '<i class="far fa-star" ></i>'.repeat(emptyStars);

    return stars;
  }
}
