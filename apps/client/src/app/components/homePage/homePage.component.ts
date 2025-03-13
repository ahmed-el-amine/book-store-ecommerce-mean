import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './hero/hero.component';
import { BookService } from '../../service/books/book.service';
import { BookEssential } from '../../interfaces/BookEssential';
import { BookCardComponent } from '../../shared/book-card/book-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, HeroComponent, RouterLink, BookCardComponent],
  templateUrl: './homePage.component.html',
  styleUrls: ['./homePage.component.css'],
})
export class HomePageComponent implements OnInit {
  featuredBooks: BookEssential[] = [];
  isLoading = false;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadFeaturedBooks();
  }

  loadFeaturedBooks(): void {
    this.isLoading = true;
    this.bookService.getBooksEssential().subscribe({
      next: (books) => {
        // Get only the first 6 books or all if fewer than 6
        this.featuredBooks = books.slice(0, 6);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading featured books', err);
        this.isLoading = false;
      },
    });
  }
}
