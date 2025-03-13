import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { StarsGeneratorComponent } from '../stars-generator/stars-generator.component';
import { CartService } from '../../service/cart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css'],
  imports: [StarsGeneratorComponent, RouterLink, CommonModule],
  standalone: true,
})
export class BookCardComponent {
  @Input() bookData!: any;
  isAddingToCart = false;

  constructor(private cartService: CartService, private authService: AuthService, private toastr: ToastrService, private cdr: ChangeDetectorRef) {}

  addToCart() {
    if (this.isAddingToCart) return;

    this.isAddingToCart = true;

    // Use take(1) to automatically complete the subscription after getting one value
    this.authService.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user) {
        const userId = user.id || user._id;

        if (userId && this.bookData._id) {
          this.cartService.addToCart(userId, this.bookData._id, 1).subscribe({
            next: () => {
              this.toastr.success('Book added to cart successfully', 'Success');
              this.isAddingToCart = false;
              this.cdr.detectChanges();
            },
            error: (error) => {
              this.toastr.error("Selected book is out of stock");
              this.isAddingToCart = false;
              this.cdr.detectChanges();
              console.error('Error adding to cart:', error);
            },
          });
        } else {
          console.error('Missing user ID or book ID');
          this.isAddingToCart = false;
        }
      } else {
        this.toastr.info('Please login to add items to cart', 'Information');
        this.isAddingToCart = false;
        this.cdr.detectChanges();
      }
    });
  }
}
