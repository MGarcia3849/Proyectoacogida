import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { environment } from '../../../../src/environments/environment';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

interface Usuario {
  email: string;
  uid: string;
  rol: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private firebaseApp = initializeApp(environment.firebaseConfig);
  public db = getFirestore(this.firebaseApp);
  private auth = getAuth(this.firebaseApp);

  constructor() {}

  async getUsuarios() {
    const querySnapshot = await getDocs(collection(this.db, 'usuarios'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async addUsuario(usuario: Usuario) {
    return addDoc(collection(this.db, 'usuarios'), usuario);
  }

  async updateUsuario(id: string, usuario: Partial<Usuario>) {
    const usuarioRef = doc(this.db, 'usuarios', id);
    return updateDoc(usuarioRef, usuario);
  }

  async deleteUsuario(id: string) {
    const usuarioRef = doc(this.db, 'usuarios', id);
    return deleteDoc(usuarioRef);
  }
}