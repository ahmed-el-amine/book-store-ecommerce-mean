import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { BookService } from '../../../service/books/book.service';
import { Book } from '../../../interfaces/BookDetails';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  currentUser: any = null;
  books: Book[] = [];

  constructor(private authService: AuthService, private bookService: BookService) {
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });

    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.bookService.getBooksDetails().subscribe({
      next: (data: Book[]) => {
        this.books = data;
      },
      error: (error) => {
        console.error('Error fetching books data', error);
      },
      complete: () => {
        console.log('Finished loading books');
      },
    });
  }

  logUserOut() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logged out user successfully');
      },
      error: (err) => {
        console.error('Error during logout', err);
      },
    });
  }
}
