import { Routes } from '@angular/router';
import { Menu } from './menu/menu';
import { Cart } from './cart/cart';
import { OrderConfirmation } from './order-confirmation/order-confirmation';
import { AdminComponent } from './admin-component/admin-component';
import { AdminPizzaAvailability } from './admin-pizza-availability/admin-pizza-availability';
import { Login } from './login/login';
import { Myorders } from './my-orders/myorders';
import { adminGuardGuard } from './admin-guard-guard';
import { customerGuard } from './customer-guard';
import { Contact } from './contact/contact';
import { AccessDenied } from './access-denied/access-denied';

export const routes: Routes = [
  { path: 'access-denied', component: AccessDenied },
  { path: 'contact', component: Contact },

  { path: 'my-orders', component: Myorders, canActivate: [customerGuard] },
  { path: 'login', component: Login },

  { path: 'order-confirmation/:publicId', component: OrderConfirmation },
  { path: '', component: Menu },
  { path: 'cart', component: Cart,canActivate: [customerGuard] },

  {
    path: 'admin',
    canActivate: [adminGuardGuard],
    children: [
      { path: 'orders', component: AdminComponent },
      { path: 'pizzas', component: AdminPizzaAvailability },
    ],
  },

  { path: '**', redirectTo: '' },
];
