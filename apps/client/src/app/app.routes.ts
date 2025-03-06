import { Route } from '@angular/router';
import { BookDetailsComponent } from './book-details/book-details.component';
import { CartComponent } from './components/cart/cart.component';
import { HomePageComponent } from './components/homePage/homePage.component';

export const appRoutes: Route[] = [

    {
        path: 'book-details/:id',
        component: BookDetailsComponent
    },{
      path:'cart-details',
      component:CartComponent,
      title:'Cart Items'
    },{
      path:'',
      component:HomePageComponent,
      title:'Home'
    }




];
