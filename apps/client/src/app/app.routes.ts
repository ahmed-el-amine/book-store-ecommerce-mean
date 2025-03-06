import { Route } from '@angular/router';
import { BookDetailsComponent } from './book-details/book-details.component';
import { HomePageComponent } from './components/homePage/homePage.component';
import { CartComponent } from './components/Cart/cart.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';

export const appRoutes: Route[] = [
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'book-details/:id',
    component: BookDetailsComponent,
  },
  {
    path: 'cart-details',
    component: CartComponent,
    title: 'Cart Items',
  },
  {
    path: '',
    component: HomePageComponent,
    title: 'Home',
  },
];
