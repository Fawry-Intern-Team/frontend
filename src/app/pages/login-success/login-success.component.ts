import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';

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
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const email = params['email'];
      const firstName = params['firstName'];
      const lastName = params['lastName'];
      const picture = params['picture'];
      const googleId = params['googleId'];
      const roles = params['roles']?.split(',') || [];
      console.log(email + ' ' + firstName + ' ' + lastName + ' ' + picture + ' ' + googleId + ' ' + roles);
      if (email && firstName && lastName) {
        const user: User = {
          email,
          firstName,
          lastName,
          photoURL: picture,
          userId: googleId,
          roles
        };

        this.authService.setUser(user);
        this.router.navigate([this.authService.getLoginRedirectPath()])
          .then(() => window.location.reload());
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
