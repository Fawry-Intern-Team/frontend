import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-success',
  standalone: true,
  imports: [CommonModule],
  template: `<p>Logging in...</p>`
})
export class LoginSuccessComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      const name = params['name'];
      const picture = params['picture'];
      const googleId = params['googleId'];
      const roles = params['roles']?.split(',') || [];

      if (email && name && roles.length > 0) {
        const user = {
          email,
          name,
          userId: googleId,
          roles
        };

        // Store user info in AuthService or localStorage if needed
        this.authService.setUser(user);
        this.router.navigate([this.authService.getLoginRedirectPath()]);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
