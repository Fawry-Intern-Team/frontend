import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { AccountService } from '../../../services/account-service';
import { AccountLogin } from '../../../models/Account';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    MessageModule,
    RouterModule
  ],
  providers: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  message: string = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AccountService
  ) {
    this.loginForm = this.fb.group({
      cardNumber: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

 onSubmit() {
  if (this.loginForm.invalid) return;

  const formData: AccountLogin = this.loginForm.value;

  this.accountService.login(formData).subscribe({
    next: data => {
      this.accountService.setLoggedInUser(data);
      this.router.navigate(['user/dashboard']);
    },
    error: err => {
      console.log('Login error:', err);
      this.message = err?.error || 'An unexpected error occurred';
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }
  });
}

}
