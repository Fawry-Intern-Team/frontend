import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RouterLink } from '@angular/router';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    RouterLink,
    MessageModule
  ],
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  passwordMismatch = false;
  formSubmitted = false;

  constructor(private auth: AuthService, private router: Router) {}

  validatePasswordMatch(): void {
    if (this.confirmPassword === '') {
      this.passwordMismatch = false;
    } else {
      this.passwordMismatch = this.password !== this.confirmPassword;
    }
  }

  onRegister(): void {
    this.formSubmitted = true;
    if (this.passwordMismatch || !this.email || !this.password || !this.confirmPassword) {
      return;
    }

    this.auth.register({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        localStorage.setItem('accessToken', res['Access-Token']);
        this.router.navigate([this.auth.getRegisterRedirectPath()]);
      },
      error: (err) => {
        // handle registration error if needed
      }
    });
  }

  loginWithGoogle(): void {
    this.auth.googleLogin(); // redirects to Google login
  }
} 