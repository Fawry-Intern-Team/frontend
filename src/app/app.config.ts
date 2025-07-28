import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { authInterceptor } from './services';


export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    provideHttpClient(withInterceptors([authInterceptor])),  // ✅ Add auth interceptor
    // Auth configuration
    {
      provide: 'AUTH_CONFIG',
      useValue: {
        baseUrl: 'http://localhost:8080',
        loginRedirectPath: '/products',
        registerRedirectPath: '/login',
        googleOAuthPath: '/oauth2/authorization/google',
        refreshPath: '/auth/refresh',
        loginPath: '/auth/login',
        registerPath: '/auth/register'
      }
    },
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
