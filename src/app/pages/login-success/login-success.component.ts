import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const accessToken = new URLSearchParams(window.location.hash.slice(1)).get('accessToken');
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      this.router.navigate([this.authService.getLoginRedirectPath()]);
    } else {
      // Handle error or redirect to login
      this.router.navigate(['/login']);
    }
  }
} 