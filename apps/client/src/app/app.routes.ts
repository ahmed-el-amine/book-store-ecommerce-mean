import { Route } from '@angular/router';
import { BookDetailsComponent } from './book-details/book-details.component';
import { CartComponent } from './components/Cart/cart.component';
import { HomePageComponent } from './components/homePage/homePage.component';
import { OrdersHistoryComponent } from './components/orders-history/orders-history.component';

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
    },
    {
      path:'orders-history',
      component:OrdersHistoryComponent,
      title:'Order History'
    }




];
