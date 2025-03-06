import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/Header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { NgxStarsModule } from 'ngx-stars';

@Component({
  imports: [RouterModule,HeaderComponent,HeroComponent,NgxStarsModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
