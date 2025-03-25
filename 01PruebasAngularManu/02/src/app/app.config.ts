import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp} from '@angular/fire/app';
import { getAuth, provideAuth} from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore'


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};

const firebaseConfig = {
  apiKey: "AIzaSyApu7jsbHrQYqb_8ZAy57fKYy3AUFDXR18",
  authDomain: "database-5193c.firebaseapp.com",
  projectId: "database-5193c",
  storageBucket: "database-5193c.firebasestorage.app",
  messagingSenderId: "607913514815",
  appId: "1:607913514815:web:3b386a45dad7780e1be58a"
};

const app = initializeApp(firebaseConfig);
