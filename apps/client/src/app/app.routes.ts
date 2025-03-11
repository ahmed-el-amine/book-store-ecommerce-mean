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
import { ReviewSectionComponent } from './book-details/review-section/review-section.component';
import { EmailVerifyComponent } from './components/auth/email-verify/email-verify.component';

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
    path: 'auth/verify-email/:token',
    component: EmailVerifyComponent,
    title: 'Verify Email',
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
    data: { mode: 'add' },
    title: 'Add book',
  },
  {
    path: 'books/update',
    data: { mode: 'update' },
    component: BookManageComponent,
  },
  {
    path: 'books/delete',
    data: { mode: 'delete' },
    component: BookManageComponent,
  },
  {
    path: 'show-reviews:bookId',
    component: ReviewSectionComponent,
  },
];
