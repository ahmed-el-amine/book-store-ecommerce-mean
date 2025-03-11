import { Component, Input } from '@angular/core';
import { StarsGeneratorComponent } from '../stars-generator/stars-generator.component';
import { Book } from '../../interfaces/BookDetails';
import { BookDetailsComponent } from "../../book-details/book-details.component";

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css'],
  imports: [StarsGeneratorComponent, BookDetailsComponent],
})
export class BookCardComponent {

  @Input() bookData!: Book ;
 

  
}
