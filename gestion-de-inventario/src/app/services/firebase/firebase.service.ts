import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { environment } from '../../../../src/environments/environment';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, onAuthStateChanged } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

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
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor() {}

  async getUsuarios() {
    const querySnapshot = await getDocs(collection(this.db, 'usuarios'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Usuario)}));
  }

  async register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    this.currentUserSubject.next(userCredential.user); //Emite el usuario logueado
    return userCredential;
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

  async cerrarSesion() {
    await signOut(this.auth);
    window.location.reload(); // Recarga la página
  }

  async getProductos() {
    const querySnapshot = await getDocs(collection(this.db, 'items'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async addProducto(producto: any) {
    try {
      const docRef = await addDoc(collection(this.db, 'items'), producto);
      console.log('Producto agregado con ID:', docRef.id);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  }

  async updateProducto(id: string, producto: Partial<any>) {
    const productoRef = doc(this.db, 'items', id);
    return updateDoc(productoRef, producto);
  }

  async deleteProducto(id: string) {
    const productoRef = doc(this.db, 'items', id);
    return deleteDoc(productoRef);
  }
  
  // Método para obtener el usuario registrado
  getAuthState(callback: (user: User | null) => void) {
    onAuthStateChanged(this.auth, callback);
  }

}