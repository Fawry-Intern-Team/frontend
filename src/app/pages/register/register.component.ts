import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FloatLabelStyle } from 'primeng/floatlabel';
import { User } from '../../models';

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
    MessageModule,
    ToastModule
  ],
  providers: [MessageService],
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  passwordMismatch = false;
  formSubmitted = false;

  constructor(private auth: AuthService, private router: Router, private messageService: MessageService) { }

  validatePasswordMatch(): void {
    this.passwordMismatch =
      this.confirmPassword !== '' && this.password !== this.confirmPassword;
  }

  loading = false;
  googleLoading = false;
  loginLoading = false;

  onRegister(): void {
    this.formSubmitted = true;

    if (this.loading) return;

    const trimmedEmail = this.email.trim();
    const isInvalid =
      this.passwordMismatch ||
      !trimmedEmail ||
      !this.password ||
      this.password.length < 6 ||
      !this.confirmPassword ||
      !this.firstName ||
      !this.lastName;

    if (isInvalid) return;

    this.loading = true;

    this.auth.register({
      email: trimmedEmail,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName
    }).subscribe({
      next: (res) => {
        // Convert and store user
        const user: User = {
          userId: res.userId,
          firstName: res.firstName,
          lastName: res.lastName,
          photoURL: '',
          email: res.email,
          roles: res.roles
        };

        this.auth.setUser(user);

        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Registeration successful' });
        this.router.navigate([this.auth.getRegisterRedirectPath()])
          .then(() => window.location.reload());
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
          this.messageService.add({
            severity: 'error',
            summary: 'Registration Failed',
            detail: 'This email is already registered.'
          });
        } else if (err.status === 503) {
          this.messageService.add({
            severity: 'error',
            summary: 'Service Unavailable',
            detail: 'The service is temporarily unavailable. Please try again later.'
          });
        }
      }
    });
  }

  loginWithGoogle(): void {
    if (this.googleLoading) return;
    this.googleLoading = true;
    this.auth.googleLogin();
  }

  navigateToLogin(): void {
    if (this.loginLoading) return;
    this.loginLoading = true;
    setTimeout(() => this.router.navigate(['/login']), 200); // optional spinner delay
  }

}