import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
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

  getProductos(): Observable<Producto[]> {
    const ref = collection(this.firestore, 'productos');
    return collectionData(ref, { idField: 'id' }) as Observable<Producto[]>;
  }
}
