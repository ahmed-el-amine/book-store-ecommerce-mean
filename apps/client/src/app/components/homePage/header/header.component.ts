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
import { CartService } from '../../../service/cart/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NotificationComponent, CollapseModule, BsDropdownModule, TooltipModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  currentUser: any = null;
  books: Book[] = [];
  isCollapsed = true;
  cartItemCount = 0;
  searchQuery = '';
  isDarkMode = false;

  constructor(private authService: AuthService, private bookService: BookService, private cartService: CartService) {
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });

    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    // Subscribe to cart changes to update badge
    this.cartService.cart$.subscribe((cart) => {
      if (cart && cart.items) {
        this.cartItemCount = cart.items.length;
      } else {
        this.cartItemCount = 0;
      }
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
    if (window.innerWidth >= 992) {
      // Bootstrap lg breakpoint
      this.isCollapsed = true; // Reset to collapsed state on desktop
    }
  }

  logUserOut() {
    this.authService.logout().subscribe({
      next: () => {
        this.cartService.clearCart(); // Clear cart on logout
      },
      error: (err) => {
        console.error('Error during logout', err);
      },
    });
  }

  // Toggle dark mode (optional feature)
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }
}
