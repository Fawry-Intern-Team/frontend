// logout.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthConfig } from '../../models';

@Component({
  standalone: true,
  selector: 'app-logout',
  template: '',
})
export class LogoutComponent implements OnInit {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get(`${this.baseUrl}/auth/clear`, { withCredentials: true }).subscribe({
      complete: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });

  }
}
