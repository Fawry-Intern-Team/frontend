import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import { AuthService } from '../../services';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(
        private auth: AuthService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | UrlTree {
        const expectedRoles = route.data['roles'] as string[];
        const user = this.auth.getCurrentUser();

        if (!user || !user.roles.some(role => expectedRoles.includes(role))) {
            return this.router.parseUrl('/forbidden');
        }

        return true;
    }
}
