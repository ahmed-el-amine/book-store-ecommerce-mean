import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/Header/header.component';
import { HeroComponent } from './components/hero/hero.component';

@Component({
  imports: [RouterModule,HeaderComponent,HeroComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
