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

export const routes: Routes = [
  {
    path: 'place-order',
    component: PlaceOrder,
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },

  { path: 'cart', component: CartComponent },

  { path: 'orders/payment', component: Payment },

  {
    path: 'otp',
    component: Otp,
  },
  {
    path: 'order-summary',
    component: OrderSummary,
  },
  { path: 'store/admin', component: AdminDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
