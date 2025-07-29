import { Injectable } from '@angular/core';
import {
  CanActivate, Router, UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectIfAuthenticatedGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.isAuthenticated().pipe(
      map(isAuth => isAuth ? this.router.createUrlTree(['/products']) : true)
    );
  }
}