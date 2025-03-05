import { Component ,Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookServiceService } from '../../service/books/book.service'

@Component({
  selector: 'app-book-section',
  imports: [CommonModule],
  templateUrl: './book-section.component.html',
  styleUrl: './book-section.component.css',
})
export class BookSectionComponent {
  @Input() bookId: string | undefined ;
  book: any = null;

  constructor(private bookService: BookServiceService) { }
  ngOnInit(): void {

    if (this.bookId) {
      console.log(this.bookId);
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
    // console.log(this.bookId);
    console.log("hiii",this.book);
  }

}
