import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations'

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    BrowserAnimationsModule,
    provideAnimations(),
    provideRouter(routes)]
};
