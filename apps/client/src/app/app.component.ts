import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/homePage/header/header.component';
import { NgxStarsModule } from 'ngx-stars';

@Component({
  imports: [RouterModule, HeaderComponent, RouterOutlet, NgxStarsModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
