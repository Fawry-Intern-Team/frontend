import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { User } from '../../models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    MessageModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  keepLoggedIn = false;
  formSubmitted = false;
  loading = false;
  signupLoading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
  ) { }

  navigateToSignup(): void {
    this.signupLoading = true;
    setTimeout(() => {
      this.router.navigate(['/register']);
    }, 300); // short delay to show spinner (optional)
  }


  onLogin(form: NgForm) {
    this.formSubmitted = true;

    if (this.loading || form.invalid) return;

    this.loading = true;
    const trimmedEmail = this.email.trim();

    this.auth.login({
      email: trimmedEmail,
      password: this.password,
      keepMeLoggedIn: this.keepLoggedIn
    }).subscribe({
      next: (res) => {
        this.loading = false;
    
        // Convert and store user
        const user: User = {
          userId: res.userId,
          email: res.email,
          name: 'Default',
          roles: res.roles
        };
        localStorage.setItem('user', JSON.stringify(user));
    
    
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successful' });
        this.router.navigate([this.auth.getLoginRedirectPath()]);
      },
      error: (err) => {
        this.loading = false;
    
        if (err.status === 404 || err.status === 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'Login failed',
            detail: 'Invalid credentials'
          });
        } else if (err.status === 503) {
          this.messageService.add({
            severity: 'error',
            summary: 'Service Unavailable',
            detail: 'The service is temporarily unavailable. Please try again later.'
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An unexpected error occurred.'
          });
        }
      }
    });
    
  }

  googleLoading = false;

  loginWithGoogle(): void {
    if (this.googleLoading) return;
    this.googleLoading = true;

    this.auth.googleLogin();
  }
}
