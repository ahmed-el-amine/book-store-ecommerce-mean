import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/homePage/header/header.component';
import { FooterComponent }from './components/homePage/footer/footer.component'
import { NgxStarsModule } from 'ngx-stars';

@Component({
  imports: [RouterModule, HeaderComponent, RouterOutlet, NgxStarsModule, FooterComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
