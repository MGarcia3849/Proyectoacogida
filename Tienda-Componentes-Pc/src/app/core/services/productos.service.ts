import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, addDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  precioOriginal?: number;
  imagen: string;
  descripcion: string;
  categoria: string;
  enOferta?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private firestore = inject(Firestore);
  private productosCollection = collection(this.firestore, 'productos');

  getProductos(): Observable<Producto[]> {
    const productosRef = collection(this.firestore, 'productos');
    return collectionData(productosRef, { idField: 'id' }) as Observable<Producto[]>;
  }

  getProductoById(id: string): Observable<Producto> {
    const productoRef = doc(this.firestore, `productos/${id}`);
    return docData(productoRef, { idField: 'id' }) as Observable<Producto>;
  }

  getOfertasDestacadas(): Observable<Producto[]> {
    const productosRef = collection(this.firestore, 'productos');
    return collectionData(productosRef, { idField: 'id' }) as Observable<Producto[]>;
  }

  updateProducto(producto: Producto): Promise<void> {
    const productDocRef = doc(this.firestore, `productos/${producto.id}`);
    return updateDoc(productDocRef, { ...producto });
  }

  addProducto(producto: Omit<Producto, 'id'>): Promise<any> {
    return addDoc(this.productosCollection, producto);
  }

  deleteProducto(id: string): Promise<void> {
    const productDocRef = doc(this.firestore, `productos/${id}`);
    return deleteDoc(productDocRef);
  }
}
