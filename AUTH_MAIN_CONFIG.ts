// Auth Service Main Configuration
// Add these providers to your main.ts bootstrap configuration

import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';

// Add these to your bootstrapApplication providers array:
export const AUTH_MAIN_PROVIDERS = [
  provideHttpClient(),
  provideAnimationsAsync(),
  providePrimeNG({
    theme: {
      preset: Lara,
      options: {
        darkModeSelector: '.dark-mode'
      }
    }
  })
];