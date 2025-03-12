import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../service/books/book.service';
import { BookEssential } from '../../interfaces/BookEssential';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-manage',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-manage.component.html',
  styleUrl: './book-manage.component.css',
})
export class BookManageComponent implements OnInit {
  mode = 'add';
  books: BookEssential[] = [];
  myform: FormGroup;
  showDeleteWaring = false;
  selectedBook: BookEssential | null = null;

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  currentCategoriesText = '';

  constructor(private route: ActivatedRoute, private bookService: BookService, private fb: FormBuilder, private toastr: ToastrService) {
    this.myform = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      isbn13: ['', [Validators.required, Validators.minLength(13)]],
      description: ['', [Validators.required, Validators.minLength(15)]],
      price: [0, [Validators.required, Validators.min(0)]],
      rating: [0, [Validators.required, Validators.min(0)]],
      publish_date: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      coverImage: [null, Validators.required], // We'll adjust this validator dynamically
      dimensions: this.fb.group({
        width: [null, [Validators.required, Validators.min(0)]],
        height: [null, [Validators.required, Validators.min(0)]],
        depth: [null, [Validators.required, Validators.min(0)]],
        unit: ['cm', [Validators.required]],
      }),
      weight: this.fb.group({
        value: [null, [Validators.required, Validators.min(0)]],
        unit: ['g', Validators.required],
      }),
      authors: [[], Validators.required],
      categories: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      if (data['mode']) {
        this.mode = data['mode'];
        console.log('current mode:', this.mode);
      }
    });

    this.bookService.getBooksEssential().subscribe({
      next: (data: BookEssential[]) => {
        this.books = data;
      },
      error: (error) => {
        console.error('Error fetching data', error);
      },
      complete: () => {
        console.log('Finished loading data');
      },
    });

    // Adjust the coverImage validator based on the mode
    if (this.mode === 'update') {
      this.myform.get('coverImage')?.setValidators(null);
      this.myform.get('coverImage')?.updateValueAndValidity();
    }
  }

  private formatDateForInput(dateValue: string | Date | undefined): string {
    if (!dateValue) {
      return ''; // Return empty string if no date provided
    }

    try {
      const date = new Date(dateValue);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateValue);
        return '';
      }

      // Format as YYYY-MM-DD
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  }

  onBookSelect(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.selectedBook = this.books.find((book) => book._id === selectedId) || null;

    if (this.mode === 'update' && this.selectedBook) {

      this.bookService.getBookById(this.selectedBook._id as string).subscribe({
        next: (book) => {
          // Extract author IDs if authors are objects
          const authorIds = Array.isArray(book.authors)
            ? book.authors.map((author) => (typeof author === 'object' ? author.id : author))
            : book.authors;
          // Handle categories - ensure it's an array
          const categories = Array.isArray(book.categories) ? book.categories : book.categories ? [book.categories] : [];

          this.currentCategoriesText = categories.join(', ');


          this.myform.patchValue({
            title: book.title,
            isbn13: book.isbn13,
            description: book.description,
            price: book.price,
            rating: book.rating,
            publish_date: this.formatDateForInput(book.publish_date),
            stock: book.stock,
            dimensions: {
              width: book.dimensions.width,
              height: book.dimensions.height,
              depth: book.dimensions.depth,
            },
            weight: {
              value: book.weight.value,
              unit: book.weight.unit,
            },
            authors: authorIds,
            categories: categories,
          });

          // Make coverImage optional in update mode
          this.myform.get('coverImage')?.setValidators(null);
          this.myform.get('coverImage')?.updateValueAndValidity();

          if (book.coverImage) {
            this.imagePreview = book.coverImage;
            // Store the existing image URL to use if no new file is selected
            this.myform.patchValue({ coverImage: book.coverImage });
          }
        },
        error: (error) => {
          console.log('Error fetching book details', error);
          this.toastr.error('Could not load book details try again', 'Error');
        },
      });
    }
  }

  onClickDelete() {
    this.showDeleteWaring = true;
  }

  onClickConfirm() {
    //implement the logic of delete here
    if (this.selectedBook && this.selectedBook._id) {
      this.bookService.deleteBook(this.selectedBook._id).subscribe({
        next: () => {
          this.books = this.books.filter((book) => book._id !== this.selectedBook?._id);
          this.toastr.success(`Book "${this.selectedBook?.title}" was successfully deleted`, 'Success');
          this.selectedBook = null;
          this.showDeleteWaring = false;
        },
        error: (error) => {
          console.error('Error deleting book', error);
          this.toastr.error('Failed to delete book. Please try again.', 'Error');
        },
      });
    }
  }

  onclickCancel() {
    this.showDeleteWaring = false;
  }

  showDeleteConfirmation() {
    this.showDeleteWaring = true;
  }

  //Add method to handle formdata method
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
      this.myform.patchValue({ coverImage: this.selectedFile.name });
      this.myform.get('coverImage')?.markAsTouched();
    }
  }

  onSubmit() {
    // Remove the selectedFile check for update mode
    if ((this.mode === 'add' && this.myform.valid && this.selectedFile) ||
        (this.mode === 'update' && this.myform.valid)) {
      const formData = new FormData();
      const bookData = this.myform.value;

      // Add all text form fields
      Object.keys(bookData).forEach((key) => {
        if (key !== 'coverImage') {
          if (key === 'dimensions' || key === 'weight') {
            // Handle nested objects by converting to JSON string
            formData.append(key, JSON.stringify(bookData[key]));
          } else if (key === 'authors' || key === 'categories') {
            // Handle arrays
            if (Array.isArray(bookData[key])) {
              bookData[key].forEach((item: any, index: number) => {
                formData.append(`${key}[${index}]`, item);
              });
            } else {
              formData.append(key, bookData[key]);
            }
          } else {
            // Handle regular fields
            formData.append(key, bookData[key]);
          }
        }
      });

      // Add the publish_date as ISO string
      formData.set('publish_date', new Date(bookData.publish_date).toISOString());

      // Handle the coverImage based on whether we have a new file or existing URL
      if (this.selectedFile) {
        formData.append('coverImage', this.selectedFile, this.selectedFile.name);
      } else if (this.mode === 'update') {
        // In update mode, if the coverImage is a string (URL), pass it as is
        if (typeof bookData.coverImage === 'string' && bookData.coverImage) {
          formData.append('existingCoverImage', bookData.coverImage);
        }
      }


      if (this.mode === 'add') {
        // For add mode, selectedFile is required (already checked in the if condition)
        this.bookService.addBook(formData).subscribe({
          next: (response) => {
            console.log(response);
            console.log('Book added successfully: ', response);
            this.toastr.success('Book was successfully added', 'Success');
            this.myform.reset();
            this.imagePreview = null;
            this.selectedFile = null;
          },
          error: (error) => {
            console.error('Error adding book: ', error);
            this.toastr.error('Failed to add book. Please check your inputs.', 'Error');
          },
        });
      } else if (this.mode === 'update' && this.selectedBook?._id) {
        this.bookService.updateBook(this.selectedBook._id, formData).subscribe({
          next: (response) => {
            console.log('Book updated successfully', response);
            this.toastr.success(`Book "${bookData.title}" was successfully updated`, 'Success');
            this.imagePreview = null;
          },
          error: (error) => {
            console.error('Error updating book: ', error);
            this.toastr.error('Failed to update book. Please check your inputs.', 'Error');
          },
        });
      }
    } else {
      // Mark all controls as touched
      Object.keys(this.myform.controls).forEach((key) => {
        const control = this.myform.get(key);
        control?.markAsTouched();
      });

      // Update the error message for clarity
      if (!this.selectedFile && this.mode === 'add') {
        this.toastr.warning('Please select a cover image', 'Missing Image');
      } else if (this.myform.invalid) {
        this.toastr.warning('Please fix the validation errors before submitting', 'Form Invalid');
      }
    }
  }

  getValidationError(controlPath: string): string | null {
    const parts = controlPath.split('.');
    let control: AbstractControl | null;

    // Handle nested form controls (e.g., 'dimensions.width')
    if (parts.length > 1) {
      const group = this.myform.get(parts[0]);
      if (!group) return null;
      control = group.get(parts[1]);
    } else {
      control = this.myform.get(controlPath);
    }

    if (!control || !control.invalid || !control.touched) return null;

    if (control.hasError('required')) {
      return `${this.formatControlName(parts[parts.length - 1])} is required`;
    }
    if (control.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `Minimum length is ${requiredLength} characters`;
    }
    if (control.hasError('min')) {
      const min = control.getError('min').min;
      return `Value must be greater than or equal to ${min}`;
    }

    return 'Invalid input';
  }

  private formatControlName(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1') // Insert a space before each uppercase letter
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  }

  onCancel(): void {
    // Reset the form
    this.myform.reset();
    // Clear image preview
    this.imagePreview = null;
    this.selectedFile = null;
    // Reset selected book if in update mode
    this.selectedBook = null;
    // Show a message
    this.toastr.info('Form has been reset', 'Cancelled');
  }
}
