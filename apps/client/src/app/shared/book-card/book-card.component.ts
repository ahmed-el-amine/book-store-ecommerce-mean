import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { StarsGeneratorComponent } from '../stars-generator/stars-generator.component';
import { Book } from '../../interfaces/BookDetails';
import { CartService } from '../../service/cart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css'],
  imports: [StarsGeneratorComponent, RouterLink],
})
export class BookCardComponent {
  @Input() bookData!: Book;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}




  addToCart() {
    // Use take(1) to automatically complete the subscription after getting one value
    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        const userId = user.id || user._id;

        if (userId && this.bookData._id) {
          this.cartService.addToCart(userId, this.bookData._id, 1).subscribe({
            next: () => {
              // Show toast and manually trigger change detection
              this.toastr.success('Book added to cart successfully', 'Success');
              this.cdr.detectChanges();
            },
            error: (error) => {
              this.toastr.error('Failed to add book to cart', 'Error');
              this.cdr.detectChanges();
              console.error('Error adding to cart:', error);
            }
          });
        } else {
          console.error('Missing user ID or book ID');
        }
      } else {
        this.toastr.info('Please login to add items to cart', 'Information');
        this.cdr.detectChanges();
      }
    });
  }



}
