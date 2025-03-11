import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, Cart, CartItem } from '../../service/cart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading = true;
  error = '';
  userId = '';

  constructor(private cartService: CartService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    console.log('Auth state:', this.authService.isAuthenticated);

    this.authService.currentUser$.subscribe((user: any) => {
      console.log('Current user from subscription:', user);
      if (user) {
        // Try both id and _id to be safe
        this.userId = user.id || user._id;

        if (this.userId) {
          this.loadCart();
        } else {
          console.error('User object does not contain id or _id:', user);
          this.router.navigate(['/auth/login']);
        }
      } else {
        this.router.navigate(['/auth/login']);
      }
    });

    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
      this.loading = false;
    });
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart(this.userId).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.error = 'Failed to load your cart. Please try again.';
        this.loading = false;
      },
    });
  }

  increaseQuantity(item: CartItem): void {
    if (item.quantity < 99) {
      this.cartService.updateQuantity(this.userId, item.bookId, item.quantity + 1).subscribe({
        error: (err) => console.error('Error updating quantity:', err),
      });
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(this.userId, item.bookId, item.quantity - 1).subscribe({
        error: (err) => console.error('Error updating quantity:', err),
      });
    }
  }

  removeItem(bookId: string): void {
    this.cartService.removeFromCart(this.userId, bookId).subscribe({
      error: (err) => console.error('Error removing item:', err),
    });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  // Keep just this helper method for the subtotal
  getSubtotal(): number {
    return this.cart?.totalPrice || 0;
  }
}
