import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../service/books/book.service';
import { BookEssential } from '../../interfaces/BookEssential';

@Component({
  selector: 'app-book-manage',
  imports: [CommonModule],
  templateUrl: './book-manage.component.html',
  styleUrl: './book-manage.component.css',
})
export class BookManageComponent implements OnInit {
  mode = 'add';
  books: BookEssential[] = [];

  constructor(private route: ActivatedRoute, private bookService: BookService) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      if (data['mode']) {
        this.mode = data['mode'];
        console.log('current mode:', this.mode);
      }
    });

    this.bookService.getBooksEssential().subscribe({
      next: (data: BookEssential[]) => {
        this.books = data;
      },
      error: (error) => {
        console.error('Error fetching data', error);
      },
      complete: () => {
        console.log('Finished loading data');
      },
    });
  }
}
