import { Routes } from '@angular/router';
import { UserDashboard } from './pages/user/user-dashboard/user-dashboard';
import { AccountTransactions } from './pages/admin/account-transactions/account-transactions';
import { AdminDashboard } from './pages/admin/admin-dashboard/admin-dashboard';
import { OrderList } from './pages/order/order-list/order-list';
import { OrderDetails } from './pages/order/order-details/order-details';
import { MakeOrder } from './pages/order/make-order/make-order';
import { Payment } from './pages/order/payment/payment';
import { Login } from './pages/auth/login/login';
import { AccountForm } from './components/account/account-form/account-form';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component:Login },
  { path: 'user/dashboard', component: UserDashboard },
  { path: 'admin/dashboard', component: AdminDashboard },
  {
    path: 'admin/accounts/:id/transactions', component: AccountTransactions,
  },

  { path: 'orders', component: OrderList },
  { path: 'orders/payment', component: Payment },
  { path: 'orders/new', component: MakeOrder },
  { path: 'orders/:id', component: OrderDetails },
  { path: 'accounts/create', component: AccountForm },
{ path: 'accounts/edit/:cardNumber', component: AccountForm },

];
