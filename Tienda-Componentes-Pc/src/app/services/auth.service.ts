import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root'  // Esto hace que el servicio esté disponible en toda la aplicación
})
export class AuthService {
  constructor(private auth: Auth) {}

  // Método para login con correo y contraseña
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Método para login con Google
  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  // Método para salir de la sesión
  logout() {
    return this.auth.signOut();
  }
}
