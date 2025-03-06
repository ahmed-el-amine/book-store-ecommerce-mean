import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './hero/hero.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule,HeroComponent,FooterComponent],
  templateUrl: './homePage.component.html',
  styleUrl: './homePage.component.css',
})
export class HomePageComponent {}
