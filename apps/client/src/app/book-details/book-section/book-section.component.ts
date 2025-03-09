import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../service/books/book.service'

@Component({
  selector: 'app-book-section',
  imports: [CommonModule],
  templateUrl: './book-section.component.html',
  styleUrl: './book-section.component.css',
})
export class BookSectionComponent implements OnInit {
  @Input() bookId: string | undefined;
  book: any = null;

  constructor(private bookService: BookService) { }

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
  getStars(rating: number) {
    const fullStars = Math.floor(rating);  // عدد النجوم المملوءة بالكامل
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;  // نصف نجم إذا كان التقييم أكبر من أو يساوي 0.5
    const emptyStars = 5 - fullStars - halfStar;  // عدد النجوم الفارغة

    return {
      full: fullStars,   // عدد النجوم المملوءة
      half: halfStar,    // هل هناك نصف نجم
      empty: emptyStars  // عدد النجوم الفارغة
    };
  }
}
