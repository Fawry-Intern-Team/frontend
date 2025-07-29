import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-google-button',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <button pButton type="button" class="p-button-outlined google-btn" (click)="onClick()">
      <span class="google-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 533.5 544.3">
          <path fill="#4285f4" d="M533.5 278.4c0-17.4-1.4-34.1-4-50.2H272v95.1h146.9c-6.3 34-25 62.7-53.5 81.9v67h86.4c50.6-46.6 81.7-115.3 81.7-193.8z"/>
          <path fill="#34a853" d="M272 544.3c72.6 0 133.6-24 178.2-65.1l-86.4-67c-24 16.1-54.7 25.6-91.8 25.6-70.5 0-130.3-47.6-151.6-111.3h-89.4v69.9c44.8 88.4 137 148 241 148z"/>
          <path fill="#fbbc04" d="M120.4 326.5c-10.1-30-10.1-62.4 0-92.5v-69.9h-89.4c-38.6 76.4-38.6 166 0 242.4l89.4-69.9z"/>
          <path fill="#ea4335" d="M272 107.7c39.4-.6 77 13.5 106 39.5l79.3-79.3C412.2 24 345.4-.6 272 0 168.9 0 76.7 59.6 31 148l89.4 69.9C141.6 155.3 201.5 107.7 272 107.7z"/>
        </svg>
      </span>
      <span>{{ buttonText }}</span>
    </button>
  `,
  styles: [`
    .google-btn {
      width: 100%;
      font-weight: 500;
      font-size: 1.08rem;
      color: #444 !important;
      border: 1.5px solid #e0e0e0 !important;
      background: #fff !important;
      box-shadow: none !important;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 0.7rem;
      padding-left: 1.1rem !important;
      border-radius: 8px !important;
      transition: background 0.2s, border 0.2s;
      height: 48px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .google-btn:hover {
      background: #f5f5f5 !important;
      border-color: #bdbdbd !important;
    }
    .google-icon {
      width: 22px;
      height: 22px;
      margin-right: 0.5rem;
      display: inline-block;
      vertical-align: middle;
    }
  `]
})
export class GoogleButtonComponent {
  @Output() googleClick = new EventEmitter<void>();
  
  buttonText = 'Login with Google';

  onClick() {
    this.googleClick.emit();
  }
} 