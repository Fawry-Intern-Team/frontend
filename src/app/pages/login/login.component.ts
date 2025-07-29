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
    RouterLink,
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

  constructor(
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  onLogin(form: NgForm) {
    this.formSubmitted = true;
    if (form.invalid) return;
    
    console.log('keepLoggedIn:', this.keepLoggedIn);

    this.auth.login({
      email: this.email,
      password: this.password,
      keepMeLoggedIn: this.keepLoggedIn
    }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successful' });
        this.router.navigate([this.auth.getLoginRedirectPath()]);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Login failed', detail: 'Invalid credentials' });
      }
    });
  }

  loginWithGoogle() {
    this.auth.googleLogin();
  }
}