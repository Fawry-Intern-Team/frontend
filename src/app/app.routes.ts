import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { UserDashboard } from './pages/user/user-dashboard/user-dashboard';
import { AccountTransactions } from './pages/admin/account-transactions/account-transactions';
import { AdminDashboard } from './pages/admin/admin-dashboard/admin-dashboard';
import { OrderList } from './pages/order/order-list/order-list';
import { OrderDetails } from './pages/order/order-details/order-details';
import { MakeOrder } from './pages/order/make-order/make-order';
import { Payment } from './pages/order/payment/payment';
export const routes: Routes = [
  { path: '', redirectTo: 'user/dashboard', pathMatch: 'full' },
  { path: 'user/dashboard', component: UserDashboard },
  { path: 'admin/dashboard', component: AdminDashboard },
  {
    path: 'admin/accounts/:cardNumber/transactions', component: AccountTransactions,
  },

  { path: 'orders', component: OrderList },
  { path: 'orders/payment', component: Payment },
  { path: 'orders/new', component: MakeOrder },
  { path: 'orders/:id', component: OrderDetails }
];
