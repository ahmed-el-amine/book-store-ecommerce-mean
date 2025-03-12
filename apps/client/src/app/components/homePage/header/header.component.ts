import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { BookService } from '../../../service/books/book.service';
import { Book } from '../../../interfaces/BookDetails';
import { NotificationComponent } from '../../notification/notification.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, NotificationComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
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
