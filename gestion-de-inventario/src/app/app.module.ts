import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './componentes/header/header.component';
import { AuthComponent } from './componentes/auth/auth.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp({ projectId: "proyectoacogida-e96c5", appId: "1:642041507336:web:2b460d8bff65f3ce00abbd", storageBucket: "proyectoacogida-e96c5.firebasestorage.app", apiKey: "AIzaSyCVUo7v7pxLV0C6ekab6ZwzmCSIiVlzmbM", authDomain: "proyectoacogida-e96c5.firebaseapp.com", messagingSenderId: "642041507336", measurementId: "G-5GVZLXWNPG" })),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
