import { Component, Input } from '@angular/core';
import { NgxStarsModule } from 'ngx-stars';
import { Book } from '../../interfaces/BookDetails';

@Component({
  selector: 'app-stars-generator',
  imports: [NgxStarsModule],
  templateUrl: './stars-generator.component.html',
  styleUrl: './stars-generator.component.css',
})
export class StarsGeneratorComponent {
  @Input() currProduct!: Book;
  onRatingChange(rating: number) {
    console.log('New rating:', rating);
  }
}
