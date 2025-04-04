// src/app/core/services/productos.service.ts
import { Injectable } from '@angular/core';
import { collection, collectionData, doc, docData, Firestore } from '@angular/fire/firestore';
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
  constructor(private firestore: Firestore) {}

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
    // Filtrar ofertas se puede hacer en el componente con RxJS si lo prefieres.
  }
}
