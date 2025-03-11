import { Component, Input } from '@angular/core';
import { StarsGeneratorComponent } from '../stars-generator/stars-generator.component';
import { Book } from '../../interfaces/BookDetails';
import { CartService } from '../../service/cart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css'],
  imports: [StarsGeneratorComponent],
})
export class BookCardComponent {
  @Input() bookData!: any;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  addToCart() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        const userId = user.id || user._id;

        console.log(this.bookData);

        if (userId && this.bookData._id) {
          this.cartService.addToCart(userId, this.bookData._id, 1).subscribe({
            next: (response) => {
              this.toastr.success('Book added to cart successfully', 'Success');
            },
            error: (error) => {
              this.toastr.error('Failed to add book to cart', 'Error');
              console.error('Error adding to cart:', error);
            }
          });
        } else {
          console.error('Missing user ID or book ID');
        }
      } else {
        this.toastr.info('Please login to add items to cart', 'Information');
      }
    });
  }
}
