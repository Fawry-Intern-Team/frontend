import { Routes } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { LoginSuccessComponent } from '../pages/login-success/login-success.component';
import { RedirectIfAuthenticatedGuard } from '../shared/guards/RedirectIfAuthenticatedGuard.guard';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [RedirectIfAuthenticatedGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [RedirectIfAuthenticatedGuard] },
  { path: 'login-success', component: LoginSuccessComponent }
]; 