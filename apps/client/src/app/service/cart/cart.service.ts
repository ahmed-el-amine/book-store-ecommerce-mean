import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';

export interface CartItem {
  bookId: string;
  quantity: number;
  price: number;
  title: string;
  coverImage?: string;
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
  private apiUrl = '/api/v1/cart';
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
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

  getCart(userId: string): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/${userId}`).pipe(
      tap((cart) => this.cartSubject.next(cart)),
      catchError((error) => {
        console.error('Error fetching cart:', error);
        return of({ userId, items: [], totalPrice: 0 } as Cart);
      })
    );
  }

  addToCart(userId: string, bookId: string, quantity: number = 1): Observable<any> {
    return this.http.post<any>(this.apiUrl, { userId, bookId, quantity }).pipe(tap((response) => this.cartSubject.next(response.cart)));
  }

  removeFromCart(userId: string, bookId: string): Observable<any> {
    return this.http
      .delete<any>(this.apiUrl, {
        body: { userId, bookId },
      })
      .pipe(tap((response) => this.cartSubject.next(response.cart)));
  }

  updateQuantity(userId: string, bookId: string, quantity: number): Observable<any> {
    const currentCart = this.cartSubject.value;
    if (!currentCart) return of(null);

    const updatedItems = currentCart.items.map((item) => {
      if (item.bookId === bookId) {
        return { ...item, quantity };
      }
      return item;
    });

    return this.updateCart(userId, updatedItems);
  }

  updateCart(userId: string, items: CartItem[]): Observable<any> {
    return this.http.put<any>(this.apiUrl, { userId, items }).pipe(tap((response) => this.cartSubject.next(response.cart)));
  }
}
