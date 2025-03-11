import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, Cart, CartItem } from '../../service/cart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart | null = null;
  initialLoading = true; // For initial cart loading
  operationLoading = false; // For CRUD operations
  error = '';
  userId = '';
  private subscriptions: Subscription[] = [];

  constructor(private cartService: CartService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Set initial loading state
    this.initialLoading = true;

    // Subscribe to user authentication
    const userSub = this.authService.currentUser$.subscribe((user: any) => {
      if (user) {
        // Try both id and _id to be safe
        this.userId = user.id || user._id;

        if (this.userId) {
          this.loadCart();
        } else {
          console.error('User object does not contain id or _id:', user);
          this.initialLoading = false;
          this.router.navigate(['/auth/login']);
        }
      } else {
        this.initialLoading = false;
        this.router.navigate(['/auth/login']);
      }
    });

    // Subscribe to cart updates
    const cartSub = this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
      if (cart !== null) {
        // Only set loading to false when we have a definitive cart result
        this.initialLoading = false;
      }
    });

    // Store subscriptions for cleanup
    this.subscriptions.push(userSub, cartSub);
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  loadCart(): void {
    this.initialLoading = true;
    this.cartService.getCart(this.userId).subscribe({
      next: (cart) => {
        console.log('Cart loaded successfully:', cart);
        this.initialLoading = false;
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.error = 'Failed to load your cart. Please try again.';
        this.initialLoading = false;
      },
    });
  }

  increaseQuantity(item: CartItem): void {
    if (item.quantity < 99) {
      this.operationLoading = true;

      const bookId = this.getBookId(item);

      if (!this.cart) {
        this.operationLoading = false;
        return;
      }

      const updatedItems = [...this.cart.items];
      const itemIndex = updatedItems.findIndex((i) => this.getBookId(i) === bookId);

      if (itemIndex !== -1) {
        // Create a new object to avoid direct mutation
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: item.quantity + 1,
        };

        this.cartService.updateCart(this.userId, updatedItems).subscribe({
          next: (response) => {
            console.log('Cart updated with increased quantity:', response);
            this.operationLoading = false;
          },
          error: (err) => {
            console.error('Error increasing quantity:', err);
            this.error = 'Failed to update quantity. Please try again.';
            this.operationLoading = false;
            this.loadCart(); // Reload cart to ensure consistent state
          },
        });
      } else {
        console.error('Item not found in cart for quantity increase');
        this.operationLoading = false;
      }
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.operationLoading = true;

      const bookId = this.getBookId(item);

      if (!this.cart) {
        this.operationLoading = false;
        return;
      }

      const updatedItems = [...this.cart.items];
      const itemIndex = updatedItems.findIndex((i) => this.getBookId(i) === bookId);

      if (itemIndex !== -1) {
        // Create a new object to avoid direct mutation
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: item.quantity - 1,
        };

        this.cartService.updateCart(this.userId, updatedItems).subscribe({
          next: (response) => {
            console.log('Cart updated with decreased quantity:', response);
            this.operationLoading = false;
          },
          error: (err) => {
            console.error('Error decreasing quantity:', err);
            this.error = 'Failed to update quantity. Please try again.';
            this.operationLoading = false;
            this.loadCart(); // Reload cart to ensure consistent state
          },
        });
      } else {
        console.error('Item not found in cart for quantity decrease');
        this.operationLoading = false;
      }
    }
  }

  removeItem(item: CartItem): void {
    this.operationLoading = true;

    const bookId = this.getBookId(item);

    console.log('Removing item with book ID:', bookId);

    this.cartService.removeFromCart(this.userId, bookId).subscribe({
      next: (response) => {
        console.log('Item removed successfully:', response);
        this.operationLoading = false;
      },
      error: (err) => {
        console.error('Error removing item:', err);
        this.error = 'Failed to remove item. Please try again.';
        this.operationLoading = false;
        this.loadCart(); // Reload cart to ensure consistent state
      },
    });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  getSubtotal(): number {
    return this.cart?.totalPrice || 0;
  }

  // Helper function to get the correct image URL
  getBookImage(item: CartItem): string {
    return this.cartService.getBookImage(item);
  }

  // Helper function to get the correct book ID
  getBookId(item: CartItem): string {
    return this.cartService.getBookId(item);
  }

  getBookTitle(item: CartItem): string {
    return this.cartService.getBookTitle(item);
  }

  getBookPrice(item: CartItem): number {
    return this.cartService.getBookPrice(item);
  }

  getItemTotal(item: CartItem): number {
    return this.getBookPrice(item) * item.quantity;
  }

  // Clear any error messages
  clearError(): void {
    this.error = '';
  }
}
