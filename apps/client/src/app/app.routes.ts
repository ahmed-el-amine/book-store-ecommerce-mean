import { Routes } from '@angular/router';
import { AccountSettingsComponent } from './components/account/account-settings/account-settings.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { HomePageComponent } from './components/homePage/homePage.component';
import { CartComponent } from './components/Cart/cart.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';
import { authGuard, publicGuard } from './guards/auth.guard';
import { BookFiltersComponent } from './components/book-filters/book-filters.component';
import { BookManageComponent } from './components/book-mange/book-manage.component';
export const appRoutes: Routes = [
  {
    path: 'auth/signup',
    component: SignupComponent,
    canActivate: [publicGuard],
    title: 'Sign Up',
  },
  {
    path: 'auth/login',
    component: LoginComponent,
    canActivate: [publicGuard],
    title: 'Login',
  },
  {
    path: 'book-details/:id',
    component: BookDetailsComponent,
    title: 'Book-details',
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
  {
    path: 'account',
    component: AccountSettingsComponent,
    canActivate: [authGuard],
    title: 'Account Settings',
  },
  {
    path: 'books-filters',
    component: BookFiltersComponent,

    title: 'Books',
  },
  {
    path: 'books/add',
    component: BookManageComponent,
  },
];
