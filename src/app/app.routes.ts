import { Routes } from '@angular/router';
import { PlaceOrder } from './pages/place-order/place-order';
import { Payment } from './pages/payment/payment';
import { Otp } from './pages/otp/otp';

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
];
