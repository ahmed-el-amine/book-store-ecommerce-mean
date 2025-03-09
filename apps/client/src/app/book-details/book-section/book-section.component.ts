import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookServiceService } from '../../service/books/book.service'

@Component({
  selector: 'app-book-section',
  imports: [CommonModule],
  templateUrl: './book-section.component.html',
  styleUrl: './book-section.component.css',
})
export class BookSectionComponent {
  @Input() bookId: string | undefined;
  book: any = null;

  constructor(private bookService: BookServiceService) { }

  ngOnInit(): void {

    if (this.bookId) {
      this.bookService.getBookById(this.bookId).subscribe({
        next: (data) => {
          this.book = data; console.log("data", data)
          console.log("book", this.book)
        },
        error: (error) => { console.error('Error fetching book:', error); },
        complete: () => { console.log('Complete!'); }
      });
    } else {
      console.error('Book ID is undefined');
    }
  }
  getStars(rating: number): string {
    const fullStars = Math.floor(rating); // عدد النجوم الممتلئة
    const halfStar = (rating % 1) >= 0.5 ? 1 : 0; // نصف نجمة إذا كان التقييم يحتوي على نصف نجمة
    const emptyStars = 5 - fullStars - halfStar; // عدد النجوم الفارغة

    let stars = '';
    // إضافة النجوم الممتلئة
    stars += '<i class="fas fa-star"></i>'.repeat(fullStars);
    // إضافة نصف النجمة إذا كان هناك
    if (halfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    }
    // إضافة النجوم الفارغة
    stars += '<i class="far fa-star" ></i>'.repeat(emptyStars);

    return stars;
  }


}
