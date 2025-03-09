import { Component, Input } from '@angular/core';
import { StarsGeneratorComponent } from "../stars-generator/stars-generator.component";
import { Book } from './book.interface';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css'],
  imports: [StarsGeneratorComponent]
})
export class BookCardComponent {
@Input() bookData: Book | undefined

  book = {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 19.99,
    coverImage: "https://media.istockphoto.com/id/639695818/photo/photographer-workplace.jpg?s=1024x1024&amp;w=is&amp;k=20&amp;c=3puvOnZJWmuXv_5L76LLroWemCqVvZ-5_Oux_xvEa7w=", // Update with your image path
    rating: 4.2,
    isNew: true,
    isBestseller: true,
    isOnSale: true,
    salePrice: 14.99
  };

  // Helper to create an array for looping through stars (0 to 4)
  stars = Array(5).fill(0);
}
