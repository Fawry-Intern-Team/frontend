import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';

import { PlaceOrder } from './pages/place-order/place-order';
import { Payment } from './pages/payment/payment';
import { Otp } from './pages/otp/otp';
import { OrderSummary } from './pages/order-summary/order-summary';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { AUTH_ROUTES } from './routes';
import { AuthGuard } from './shared';
import { LogoutComponent } from './components/logout/logout';
import { RedirectIfAuthenticatedGuard } from './shared/guards/RedirectIfAuthenticatedGuard.guard';

export const routes: Routes = [
  ...AUTH_ROUTES, // public routes (login, register)

  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' }, // Redirect after login
      { path: 'place-order', component: PlaceOrder },
      { path: 'products', component: ProductsComponent },
      { path: 'cart', component: CartComponent },
      { path: 'payment', component: Payment },
      { path: 'otp', component: Otp },
      { path: 'order-summary', component: OrderSummary },
      { path: 'store/admin', component: AdminDashboardComponent },
      { path: 'logout', component: LogoutComponent}
    ],
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect if not logged in
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
