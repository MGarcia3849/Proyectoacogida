// src/app/core/services/productos.service.ts
import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, collectionData, doc,
  updateDoc, addDoc, deleteDoc, docData, query, where, // Asegúrate que query y where están importados
  getDoc // Importar getDoc si lo usas directamente, aunque docData es más común con observables
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs'; // Importa 'from' si usas promesas convertidas a observables

// Definir la interfaz aquí o en un archivo separado (producto.interface.ts)
export interface Producto {
  id?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagenDataUrl?: string; // Campo para Base64 Data URL (puede ser opcional al crear)
  enOferta?: boolean;
  precioOriginal?: number;
  stock?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private firestore = inject(Firestore);
  private productosCollection = collection(this.firestore, 'productos');

  getProductos(): Observable<Producto[]> {
    return collectionData(this.productosCollection, { idField: 'id' }) as Observable<Producto[]>;
  }

  getProductoById(id: string): Observable<Producto | undefined> {
    const productoDocRef = doc(this.firestore, `productos/${id}`);
    // docData devuelve un observable que emite undefined si el documento no existe
    return docData(productoDocRef, { idField: 'id' }) as Observable<Producto | undefined>;
  }

  getOfertasDestacadas(): Observable<Producto[]> {
    // Consulta para filtrar por enOferta == true
    const q = query(this.productosCollection, where('enOferta', '==', true));
    return collectionData(q, { idField: 'id' }) as Observable<Producto[]>;
  }

  updateProducto(id: string, data: Partial<Producto>): Promise<void> {
    const productDocRef = doc(this.firestore, `productos/${id}`);
    return updateDoc(productDocRef, data);
  }

  addProducto(producto: Omit<Producto, 'id'>): Promise<any> { // Usar Omit para asegurar que no se envíe 'id' al crear
    return addDoc(this.productosCollection, producto);
  }

  deleteProducto(id: string): Promise<void> {
    const productDocRef = doc(this.firestore, `productos/${id}`);
    return deleteDoc(productDocRef);
  }
}
