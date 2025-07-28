import { Routes } from '@angular/router';
import { PlaceOrder } from './pages/place-order/place-order';
import { Payment } from './pages/payment/payment';
import { Otp } from './pages/otp/otp';
import { OrderSummary } from './pages/order-summary/order-summary';

export const routes: Routes = [
  {
    path: 'place-order',
    component: PlaceOrder
  },
  {
    path: 'payment',
    component: Payment
  },
  {
    path: 'otp',
    component: Otp
  },
  {
    path: 'order-summary',
    component: OrderSummary
  },
];
