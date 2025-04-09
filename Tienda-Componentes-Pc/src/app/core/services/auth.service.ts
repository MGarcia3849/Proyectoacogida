import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  UserCredential
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  getDoc,
  setDoc
} from '@angular/fire/firestore';
import { BehaviorSubject, from, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioActualSubject = new BehaviorSubject<any>(null);
  usuarioActual$ = this.usuarioActualSubject.asObservable();

  private esAdminSubject = new BehaviorSubject<boolean>(false);
  esAdmin$ = this.esAdminSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.cargarDatosUsuario(user.uid);
      } else {
        this.usuarioActualSubject.next(null);
        this.esAdminSubject.next(false);
      }
    });
  }

  // 🔐 Login por email
  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((cred) => this.cargarDatosUsuario(cred.user.uid))
    );
  }

  // 🔐 Registro por email
  register(email: string, password: string, nombre: string, telefono: string, direccion: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((cred: UserCredential) => {
        const nuevoCliente = {
          uid: cred.user.uid,
          email,
          nombre,
          telefono,
          direccion,
          admin: false
        };
        const userRef = doc(this.firestore, 'clientes', cred.user.uid);
        return from(setDoc(userRef, nuevoCliente)).pipe(
          switchMap(() => this.cargarDatosUsuario(cred.user.uid))
        );
      })
    );
  }

  // 🔐 Login con Google
  loginWithGoogle() {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
      switchMap((cred: UserCredential) => {
        const userRef = doc(this.firestore, 'clientes', cred.user.uid);
        return from(getDoc(userRef)).pipe(
          switchMap((snap) => {
            if (!snap.exists()) {
              const nuevoCliente = {
                uid: cred.user.uid,
                email: cred.user.email,
                nombre: cred.user.displayName || '',
                admin: false
              };
              return from(setDoc(userRef, nuevoCliente)).pipe(
                switchMap(() => this.cargarDatosUsuario(cred.user.uid))
              );
            } else {
              return this.cargarDatosUsuario(cred.user.uid);
            }
          })
        );
      })
    );
  }

  logout() {
    return from(signOut(this.auth)).pipe(
      switchMap(() => {
        this.usuarioActualSubject.next(null);
        this.esAdminSubject.next(false);
        this.router.navigate(['/']);
        return of(null);
      })
    );
  }

  private cargarDatosUsuario(uid: string) {
    const userRef = doc(this.firestore, 'clientes', uid);
    return from(getDoc(userRef)).pipe(
      switchMap((snap) => {
        if (snap.exists()) {
          const datos = snap.data();
          this.usuarioActualSubject.next(datos);
          this.esAdminSubject.next(!!datos['admin']);
        }
        return of(null);
      })
    );
  }
}
