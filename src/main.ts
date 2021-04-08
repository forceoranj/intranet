import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { FIREBASE_OPTIONS } from '@angular/fire';

import { AppModule } from './app/app.module';
import { environment, firebaseConfig } from './environments/environment';

import { initialize as initializeFirebaseApp } from './firebase-init-app';

if (environment.production) {
  enableProdMode();
}

initializeFirebaseApp(firebaseConfig);
platformBrowserDynamic([
  {
    provide: FIREBASE_OPTIONS,
    useValue: firebaseConfig,
  },
]).bootstrapModule(AppModule)
.catch(err => console.error(err));

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
