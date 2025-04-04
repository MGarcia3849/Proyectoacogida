import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, addDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  precioOriginal: number;
  imagen: string;
  oferta: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private firestore = inject(Firestore);
  private productosCollection = collection(this.firestore, 'productos');

  getProductos(): Observable<Producto[]> {
    const ref = collection(this.firestore, 'productos');
    return collectionData(ref, { idField: 'id' }) as Observable<Producto[]>;
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
