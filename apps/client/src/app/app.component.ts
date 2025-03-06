import { Component } from '@angular/core';
import { RouterModule,RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/homePage/header/header.component';


@Component({
  imports: [RouterModule,HeaderComponent,RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
