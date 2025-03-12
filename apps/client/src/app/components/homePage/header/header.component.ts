import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { BookService } from '../../../service/books/book.service';
import { Book } from '../../../interfaces/BookDetails';
import { NotificationComponent } from '../../notification/notification.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    RouterLinkActive,
    NotificationComponent, 
    CollapseModule,
    BsDropdownModule,
    TooltipModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  currentUser: any = null;
  books: Book[] = [];
  isCollapsed = true;

  constructor(private authService: AuthService, private bookService: BookService) {
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });

    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    // Check screen size on init
    this.checkScreenSize();
  }

  // Listen for window resize events
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  // Set collapse state based on screen size
  checkScreenSize() {
    if (window.innerWidth >= 992) { // Bootstrap lg breakpoint
      this.isCollapsed = true; // Reset to collapsed state on desktop
    }
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
