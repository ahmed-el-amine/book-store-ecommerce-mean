import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, Cart, CartItem } from '../../service/cart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { addDays } from 'date-fns';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { environment } from '../../environment';

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

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService // Inject ToastrService
  ) {}

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
          this.toastr.error('User ID not found. Please log in again.', 'Error'); // Toastr for error
          this.initialLoading = false;
          this.router.navigate(['/auth/login']);
        }
      } else {
        this.toastr.error('Please log in to view your cart.', 'Error'); // Toastr for error
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
        this.toastr.success('Cart loaded successfully.', 'Success'); // Toastr for success
        this.initialLoading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load your cart. Please try again.', 'Error'); // Toastr for error
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
          next: () => {
            this.toastr.success('Quantity increased successfully.', 'Success'); // Toastr for success
            this.operationLoading = false;
          },
          error: () => {
            this.toastr.error('Failed to update quantity. Please try again.', 'Error'); // Toastr for error
            this.operationLoading = false;
            this.loadCart(); // Reload cart to ensure consistent state
          },
        });
      } else {
        this.toastr.error('Item not found in cart.', 'Error'); // Toastr for error
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
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: item.quantity - 1,
        };

        this.cartService.updateCart(this.userId, updatedItems).subscribe({
          next: () => {
            this.toastr.success('Quantity decreased successfully.', 'Success'); // Toastr for success
            this.operationLoading = false;
          },
          error: () => {
            this.toastr.error('Failed to update quantity. Please try again.', 'Error'); // Toastr for error
            this.operationLoading = false;
            this.loadCart(); // Reload cart to ensure consistent state
          },
        });
      } else {
        this.toastr.error('Item not found in cart.', 'Error');
        this.operationLoading = false;
      }
    }
  }

  removeItem(item: CartItem): void {
    this.operationLoading = true;

    const bookId = this.getBookId(item);

    this.cartService.removeFromCart(this.userId, bookId).subscribe({
      next: (response) => {
        this.toastr.success('Item removed successfully.', 'Success'); // Toastr for success
        this.operationLoading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to remove item. Please try again.', 'Error'); // Toastr for error
        this.operationLoading = false;
        this.loadCart(); // Reload cart to ensure consistent state
      },
    });
  }

  proceedToCheckout(): void {
    if (!this.userId) {
      this.toastr.error('User ID not found. Please log in again.', 'Error'); // Toastr for error
      return;
    }

    // Fetch user addresses
    this.http.get<any>(`${environment.apiUrlV1}/users/me/address`, { withCredentials: true }).subscribe({
      next: (response) => {
        if (response.address?.length > 0) {
          const userAddress = response.address[0];
          const shippingAddress = {
            street: userAddress.street,
            zipCode: userAddress.zipCode,
            country: userAddress.country,
            city: userAddress.city,
            state: userAddress.state,
          };

          const orderData = {
            userId: this.userId,
            items: this.cart?.items,
            shippingAddress,
            paymentMethod: 'Stripe', // Modify as needed
            estimatedDeliveryDate: addDays(new Date(), 3), // + days
          };

          // Place the order
          this.http.post<any>(`${environment.apiUrlV1}/orders/place-order`, orderData).subscribe({
            next: () => {
              this.toastr.success('Order placed successfully!', 'Success');
            },
            error: (err) => {
              this.toastr.error(err.error.message);
            },
          });
        } else {
          this.toastr.warning('Please add a shipping address before placing an order.', 'Warning');
        }
      },
      error: (err) => {
        this.toastr.error('Failed to retrieve address. Please try again.', 'Error');
      },
    });
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
