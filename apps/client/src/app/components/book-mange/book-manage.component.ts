import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../service/books/book.service';
import { BookEssential } from '../../interfaces/BookEssential';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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
  selectedBook:BookEssential | null = null;

  constructor(private route: ActivatedRoute, private bookService: BookService, private fb: FormBuilder) {
    this.myform = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      isbn13: ['', [Validators.required, Validators.minLength(13)]],
      description: ['', [Validators.required, Validators.minLength(15)]],
      price: [0, [Validators.required, Validators.min(0)]],
      rating: [0, [Validators.required, Validators.min(0)]],
      publish_date: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      coverImage: ['', Validators.required],
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
  }

  onBookSelect(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.selectedBook = this.books.find(book => book._id === selectedId) || null;
  }

  onClickDelete(){
    this.showDeleteWaring=true;
  }

  onClickConfirm(){
    //implement the logic of delete here
    this.showDeleteWaring=false;
  }

  onclickCancel(){
    this.showDeleteWaring=false;
  }

  showDeleteConfirmation(){
    this.showDeleteWaring = true;
  }
}
