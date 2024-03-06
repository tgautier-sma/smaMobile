import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations'

import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { ErrorInterceptorProviders } from './services/error';
import { JwtInterceptorProviders } from './services/jwt.interceptor';
import { NetworkInterceptorProviders } from './services/network.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    BrowserAnimationsModule,
    provideAnimations(),
    provideRouter(routes),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    NetworkInterceptorProviders, ErrorInterceptorProviders, JwtInterceptorProviders,
  ]
};
