import { Injectable } from '@angular/core';
import { CartItem } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class CartUpdateService {
  /**
   * Helper method to safely get the book ID from a cart item
   * Handles different data structures that might be returned by the API
   */
  getBookId(item: CartItem): string {
    if (typeof item.bookId === 'object' && item.bookId && item.bookId._id) {
      return item.bookId._id;
    } else if (typeof item.bookId === 'string') {
      return item.bookId;
    } else if (item._id) {
      // Fallback to item._id if bookId is not available
      return item._id;
    }
    console.error('Unable to determine book ID from item:', item);
    return '';
  }

  /**
   * Creates a modified copy of the cart items with updated quantity for a specific item
   */
  updateItemQuantity(items: CartItem[], bookId: string, newQuantity: number): CartItem[] {
    return items.map((item) => {
      const itemBookId = this.getBookId(item);
      if (itemBookId === bookId) {
        return {
          ...item,
          quantity: newQuantity,
        };
      }
      return item;
    });
  }

  /**
   * Creates a new array of cart items with the specified item removed
   */
  removeItem(items: CartItem[], bookId: string): CartItem[] {
    return items.filter((item) => this.getBookId(item) !== bookId);
  }
}
