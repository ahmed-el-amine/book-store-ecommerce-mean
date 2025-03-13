import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, finalize, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../environment';
import { ToastrService } from 'ngx-toastr';

// Book data that might come from API
export interface BookData {
  _id: string;
  title: string;
  price: number;
  coverImage?: string;
  // other book properties...
}

// Enhanced CartItem interface to match backend model
export interface CartItem {
  bookId: BookData | string;
  quantity: number;
  price: number;
  title: string;
  _id: string;
  coverImage?: string; // This can exist at root level based on the cart.model.js
}

export interface Cart {
  userId: string;
  items: CartItem[];
  totalPrice: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrlV1}/cart`;
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();
  private pendingRequests = 0;

  constructor(private http: HttpClient, private authService: AuthService, private toastr: ToastrService) {
    this.loadUserCart();
  }

  private loadUserCart(): void {
    this.authService.currentUser$.subscribe((user: any) => {
      if (user) {
        const userId = user.id || user._id;
        if (userId) {
          this.getCart(userId).subscribe();
        } else {
          console.error('User object does not contain id or _id:', user);
        }
      }
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  getCart(userId: string): Observable<Cart> {
    this.pendingRequests++;
    return this.http.get<Cart>(`${this.apiUrl}/${userId}`).pipe(
      tap((cart) => {
        this.cartSubject.next(cart);
      }),
      catchError((error) => {
        console.error('Error fetching cart:', error);
        this.cartSubject.next({ userId, items: [], totalPrice: 0 } as Cart);
        return of({ userId, items: [], totalPrice: 0 } as Cart);
      }),
      finalize(() => this.pendingRequests--)
    );
  }

  addToCart(userId: string, bookId: string, quantity = 1): Observable<any> {
    this.pendingRequests++;
    console.log('Adding to cart:', { userId, bookId, quantity });
    return this.http.post<any>(this.apiUrl, { userId, bookId, quantity }).pipe(
      tap((response) => {
        console.log('Book added to cart:', response);
        this.cartSubject.next(response.cart);
      }),
      catchError((error) => {
        // Return the error to be handled by component
        return this.handleError(error);
      }),
      finalize(() => this.pendingRequests--)
    );
  }

  removeFromCart(userId: string, bookId: string): Observable<any> {
    this.pendingRequests++;
    console.log('Removing from cart:', { userId, bookId });
    return this.http
      .delete<any>(this.apiUrl, {
        body: { userId, bookId },
      })
      .pipe(
        tap((response) => {
          console.log('Item removed from cart:', response);
          this.cartSubject.next(response.cart);
        }),
        catchError((error) => {
          console.error('Error removing from cart:', error);
          // Return the error to be handled by component
          return this.handleError(error);
        }),
        finalize(() => this.pendingRequests--)
      );
  }

  // There is no direct quantity endpoint in the backend. We need to update the cart items
  updateQuantity(userId: string, bookId: string, quantity: number): Observable<any> {
    this.pendingRequests++;
    console.log('Updating quantity:', { userId, bookId, quantity });

    // First get the current cart
    return this.getCart(userId).pipe(
      tap((cart) => {
        console.log('Retrieved cart for quantity update:', cart);
        if (!cart || !cart.items) {
          throw new Error('Cannot update quantity: Cart not found');
        }
      }),
      // Update the quantity for the specified bookId
      switchMap((cart) => {
        // Create a deep copy of items to avoid direct mutation
        const updatedItems = [...cart.items];

        // Find the item with matching bookId
        for (let i = 0; i < updatedItems.length; i++) {
          const item = updatedItems[i];
          const itemBookId = typeof item.bookId === 'object' ? item.bookId._id : item.bookId;

          if (itemBookId === bookId) {
            updatedItems[i] = {
              ...updatedItems[i],
              quantity: quantity,
            };
            break;
          }
        }

        // Update the entire cart with the modified items array
        return this.updateCart(userId, updatedItems);
      }),
      catchError((error) => {
        console.error('Error updating quantity:', error);
        return this.handleError(error);
      }),
      finalize(() => this.pendingRequests--)
    );
  }

  updateCart(userId: string, items: CartItem[]): Observable<any> {
    this.pendingRequests++;
    items = items.map((x: any) => {
      if (x.bookId?._id) return { ...x, bookId: x.bookId._id };
      return x;
    });
    return this.http.put<any>(this.apiUrl, { userId, items }).pipe(
      tap((response) => {
        console.log('Cart updated:', response);
        this.cartSubject.next(response.cart);
      }),
      catchError((error) => {
        console.error('Error updating cart:', error);
        return this.handleError(error);
      }),
      finalize(() => this.pendingRequests--)
    );
  }

  // Improved helper methods for use throughout the app
  getBookId(item: CartItem): string {
    if (typeof item.bookId === 'object' && item.bookId && item.bookId._id) {
      return item.bookId._id;
    } else if (typeof item.bookId === 'string') {
      return item.bookId;
    } else if (item._id) {
      return item._id;
    }
    console.error('Unable to determine book ID from item:', item);
    return '';
  }

  getBookTitle(item: CartItem): string {
    if (typeof item.bookId === 'object' && item.bookId && item.bookId.title) {
      return item.bookId.title;
    }
    return item.title || 'Unknown Title';
  }

  getBookPrice(item: CartItem): number {
    if (typeof item.bookId === 'object' && item.bookId && item.bookId.price) {
      return item.bookId.price;
    }
    return item.price || 0;
  }

  getBookImage(item: CartItem): string {
    // Check if bookId is an object with coverImage property
    if (typeof item.bookId === 'object' && item.bookId && item.bookId.coverImage) {
      // Check if the coverImage already has the full URL
      if (item.bookId.coverImage.startsWith('http')) {
        return item.bookId.coverImage;
      }
      // Otherwise, ensure it has the correct base URL
      return item.bookId.coverImage;
    } else if (item.coverImage) {
      // Check if the item itself has a coverImage property
      if (item.coverImage.startsWith('http')) {
        return item.coverImage;
      }
      return item.coverImage;
    }
    // Return placeholder if no valid image
    return '/assets/placeholder-book.png';
  }

  increaseQuantity(item: CartItem): void {
    if (item.quantity < 99) {
      const userId = this.cartSubject.value?.userId || '';
      const bookId = this.getBookId(item);

      if (!bookId) {
        console.error('Cannot increase quantity: Invalid book ID');
        return;
      }

      this.updateQuantity(userId, bookId, item.quantity + 1).subscribe({
        error: (err) => console.error('Error updating quantity:', err),
      });
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      const userId = this.cartSubject.value?.userId || '';
      const bookId = this.getBookId(item);

      if (!bookId) {
        console.error('Cannot decrease quantity: Invalid book ID');
        return;
      }

      this.updateQuantity(userId, bookId, item.quantity - 1).subscribe({
        error: (err) => console.error('Error updating quantity:', err),
      });
    }
  }

  removeItem(bookId: string): void {
    const userId = this.cartSubject.value?.userId || '';
    this.removeFromCart(userId, bookId).subscribe({
      error: (err) => console.error('Error removing item:', err),
    });
  }
}
