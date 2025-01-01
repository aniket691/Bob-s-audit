import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';  // Import routes

// Update appConfig to include routing
const updatedAppConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideRouter(routes) // Provide routes in the config
  ]
};

bootstrapApplication(AppComponent, updatedAppConfig)
  .catch((err) => console.error(err));
