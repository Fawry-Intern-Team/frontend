import { Routes } from '@angular/router';
import { UserDashboard } from './pages/user/user-dashboard/user-dashboard';
import { AccountTransactions } from './pages/admin/account-transactions/account-transactions';
import { AdminDashboard } from './pages/admin/admin-dashboard/admin-dashboard';
import { OrderList } from './pages/order/order-list/order-list';
import { OrderDetails } from './pages/order/order-details/order-details';
import { MakeOrder } from './pages/order/make-order/make-order';
import { ProductsComponent } from './components/products/products.component';
import { Payment } from './pages/order/payment/payment';
import { Login } from './pages/auth/login/login';
import { AccountForm } from './components/account/account-form/account-form';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component:Login },
  { path: 'user/dashboard', component: UserDashboard },
  { path: 'admin/dashboard', component: AdminDashboard },
  {
    path: 'admin/accounts/:cardNumber/transactions', component: AccountTransactions,
  },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrderList },
  { path: 'orders/payment', component: Payment },
  { path: 'orders/new', component: MakeOrder },
  { path: 'orders/:id', component: OrderDetails }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}