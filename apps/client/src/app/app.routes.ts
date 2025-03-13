import { OrdersHistoryComponent } from './components/orders-history/orders-history.component';
import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AccountSettingsComponent } from './components/account/account-settings/account-settings.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { HomePageComponent } from './components/homePage/homePage.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';
import { authGuard, publicGuard } from './guards/auth.guard';
import { BookFiltersComponent } from './components/book-filters/book-filters.component';
import { BookManageComponent } from './components/book-mange/book-manage.component';
import { ReviewSectionComponent } from './book-details/review-section/review-section.component';
import { EmailVerifyComponent } from './components/auth/email-verify/email-verify.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';

export const appRoutes: Routes = [
  // Auth routes - lazy loaded
  {
    path: 'auth',
    children: [
      {
        path: 'signup',
        loadComponent: () => import('./components/auth/signup/signup.component').then((m) => m.SignupComponent),
        canActivate: [publicGuard],
        title: 'Sign Up',
      },
      {
        path: 'login',
        loadComponent: () => import('./components/auth/login/login.component').then((m) => m.LoginComponent),
        canActivate: [publicGuard],
        title: 'Login',
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./components/auth/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
        canActivate: [publicGuard],
        title: 'Forgot Password',
      },
      {
        path: 'reset-password/:token',
        loadComponent: () => import('./components/auth/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
        canActivate: [publicGuard],
        title: 'Reset Password',
      },
      {
        path: 'verify-email/:token',
        loadComponent: () => import('./components/auth/email-verify/email-verify.component').then((m) => m.EmailVerifyComponent),
        title: 'Verify Email',
      },
    ],
  },

  // Book routes
  {
    path: 'book-details/:id',
    loadComponent: () => import('./book-details/book-details.component').then((m) => m.BookDetailsComponent),
    title: 'Book Details',
  },
  {
    path: 'books-filters',
    loadComponent: () => import('./components/book-filters/book-filters.component').then((m) => m.BookFiltersComponent),
    title: 'Books',
  },

  // Book management routes
  {
    path: 'books',
    children: [
      {
        path: 'add',
        loadComponent: () => import('./components/book-mange/book-manage.component').then((m) => m.BookManageComponent),
        data: { mode: 'add' },
        title: 'Add Book',
      },
      {
        path: 'update',
        loadComponent: () => import('./components/book-mange/book-manage.component').then((m) => m.BookManageComponent),
        data: { mode: 'update' },
        title: 'Update Book',
      },
      {
        path: 'delete',
        loadComponent: () => import('./components/book-mange/book-manage.component').then((m) => m.BookManageComponent),
        data: { mode: 'delete' },
        title: 'Delete Book',
      },
    ],
  },

  // Cart and checkout
  {
    path: 'cart-details',
    loadComponent: () => import('./components/cart/cart.component').then((m) => m.CartComponent),
    title: 'Cart Items',
  },

  // Account related routes
  {
    path: 'account',
    loadComponent: () => import('./components/account/account-settings/account-settings.component').then((m) => m.AccountSettingsComponent),
    canActivate: [authGuard],
    title: 'Account Settings',
  },
  {
    path: 'orders-history',
    loadComponent: () => import('./components/orders-history/orders-history.component').then((m) => m.OrdersHistoryComponent),
    canActivate: [authGuard],
    title: 'Order History',
  },

  // Home page
  {
    path: '',
    loadComponent: () => import('./components/homePage/homePage.component').then((m) => m.HomePageComponent),
    title: 'Home',
  },

  // Review section
  {
    path: 'show-reviews/:bookId',
    loadComponent: () => import('./book-details/review-section/review-section.component').then((m) => m.ReviewSectionComponent),
    title: 'Book Reviews',
  },
];
