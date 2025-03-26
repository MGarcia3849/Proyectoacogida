import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './componentes/header/header.component';
import { AuthComponent } from './componentes/auth/auth.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';
import { ListadoComponent } from './componentes/listado/listado.component';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    ListadoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
