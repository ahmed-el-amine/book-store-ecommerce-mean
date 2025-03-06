import { Component, Input } from '@angular/core';
import { NgxStarsModule } from 'ngx-stars';

@Component({
  selector: 'app-stars-generator',
  imports: [NgxStarsModule],
  templateUrl: './stars-generator.component.html',
  styleUrl: './stars-generator.component.css',
})
export class StarsGeneratorComponent {
  @Input() currProduct: any;
  onRatingChange(rating: number) {
    console.log('New rating:', rating);
  }
}
