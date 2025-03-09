import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';  // الاستيراد هن
import { BookServiceService } from '../../service/books/book.service';
import { BookCardComponent } from '../../shared/book-card/book-card.component'
import { AuthService } from '../../services/auth/auth.service';



@Component({
  selector: 'app-book-filters',
  imports: [CommonModule, BookCardComponent, ReactiveFormsModule],
  templateUrl: './book-filters.component.html',
  styleUrl: './book-filters.component.css',
})
export class BookFiltersComponent implements OnInit {

  searchForm: FormGroup;
  filters: any = {};
  books: any = null;
  categories: any[] = [
    { value: 'Fiction', name: 'Fiction' },
    { value: 'Ccience', name: 'Science' },
    { value: 'History', name: 'History' },
    { value: 'Biography', name: 'Biography' }
  ];
  userData: any;
  isAuthenticated = false;
  constructor(private bookService: BookServiceService, private authService: AuthService) {

    this.searchForm = new FormGroup({
      rating: new FormControl('', [Validators.min(1), Validators.max(5)]),
      price: new FormControl('', Validators.pattern('^[0-9]*$')),
      categories: new FormControl(''),
      title: new FormControl(''),
    });
  }
  onSubmit() {
    if (this.searchForm.valid) {
      this.filters.price = this.searchForm.value.price;
      this.filters.rating = this.searchForm.value.rating;
      this.filters.categories = this.searchForm.value.categories;
      this.filters.title = this.searchForm.value.title;

      this.bookService.getBooks(this.filters).subscribe({
        next: (response) => {
          this.books = response;
          console.log(this.books)
        },
        error: (err) => {
          console.error('soemthing wrrong happend', err);
        }
      });
    } else {
      console.log('invalid form');
    }
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.searchForm.get(controlName);
    return !!control?.invalid && (control?.touched || control?.dirty);
  }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;

    if (this.isAuthenticated) {
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          console.log('User Data:', user);//see this
          this.userData = user;
        },
        error: (err) => {
          console.error('Error fetching user data', err);
        }
      });
    }
    });

  }
}