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
import { RoleGuard } from './shared/guards/role.guard';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { LoginSuccessComponent } from './pages';

export const routes: Routes = [
  ...AUTH_ROUTES, // public routes (login, register)
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'login-success', component: LoginSuccessComponent },
  {
    path: '',
    canActivate: [AuthGuard], // must be authenticated
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: ProductsComponent },
      { path: 'cart', component: CartComponent },
      { path: 'place-order', component: PlaceOrder },
      { path: 'payment', component: Payment },
      { path: 'otp', component: Otp },
      { path: 'order-summary', component: OrderSummary },
      {
        path: 'store/admin',
        component: AdminDashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'logout',
        component: LogoutComponent
      }
    ]
  }, // Redirect if not logged in
  { path: '**', redirectTo: '' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
