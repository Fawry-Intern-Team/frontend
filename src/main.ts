import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { AUTH_MAIN_PROVIDERS } from '../AUTH_MAIN_CONFIG';
import { authInterceptor } from './app/services/auth.interceptor';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])  // <-- Register functional interceptor here
    ),
    ...AUTH_MAIN_PROVIDERS,
  ],
}).catch(err => console.error(err));
