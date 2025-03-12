import { Component, Input } from '@angular/core';
import { NgxStarsModule } from 'ngx-stars';
import { Book } from '../../interfaces/BookDetails';
import { BookEssential } from '../../interfaces/BookEssential';

@Component({
  selector: 'app-stars-generator',
  imports: [NgxStarsModule],
  templateUrl: './stars-generator.component.html',
  styleUrl: './stars-generator.component.css',
})
export class StarsGeneratorComponent {
  @Input() currProduct!: Book | BookEssential;
  onRatingChange(rating: number) {
    console.log('New rating:', rating);
  }
}
