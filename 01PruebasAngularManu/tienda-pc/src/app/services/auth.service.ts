import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  UserCredential
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  collectionData
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';

export interface Usuario {
  uid: string;
  email: string;
  rol: 'admin' | 'user';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  // Registrar usuario con correo y contraseña
  async register(email: string, password: string, rol: 'admin' | 'user'): Promise<void> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    await this.saveUser(cred.user.uid, email, rol);
  }

  // Guardar usuario en Firestore
  saveUser(uid: string, email: string, rol: 'admin' | 'user'): Promise<void> {
    const ref = doc(this.firestore, 'users', uid);
    return setDoc(ref, { uid, email, rol });
  }

  // Login con correo y contraseña
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Login con Google
  loginWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  // Obtener datos de un usuario por UID
  getUser(uid: string): Promise<any> {
    const ref = doc(this.firestore, 'users', uid);
    return getDoc(ref);
  }

  // Listar todos los usuarios
  getAllUsers(): Observable<Usuario[]> {
    const ref = collection(this.firestore, 'users');
    return collectionData(ref, { idField: 'uid' }) as Observable<Usuario[]>;
  }

  // Eliminar usuario de Firestore
  deleteUser(uid: string): Promise<void> {
    const ref = doc(this.firestore, 'users', uid);
    return deleteDoc(ref);
  }

  // Cerrar sesión
  logout(): Promise<void> {
    return signOut(this.auth);
  }
}
