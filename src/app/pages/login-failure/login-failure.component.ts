import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { CommonModule } from '@angular/common';


@Component({
  imports:[
    CardModule,
    ProgressBarModule,
    CommonModule
  ],
  selector: 'app-login-failure',
  templateUrl: './login-failure.component.html',
})
export class LoginFailureComponent implements OnInit {
  ngOnInit(): void {
    setTimeout(() => {
      window.location.href = '/login';
    }, 4000); // 4-second delay
  }
}