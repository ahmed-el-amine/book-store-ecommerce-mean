import { Route } from '@angular/router';
import { BookDetailsComponent } from './book-details/book-details.component';

export const appRoutes: Route[] = [

    {
        path: 'book-details/:id',
        component: BookDetailsComponent
    },




];
