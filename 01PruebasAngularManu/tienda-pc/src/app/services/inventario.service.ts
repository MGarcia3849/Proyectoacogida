import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';

import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL
} from '@angular/fire/storage';

import { Observable } from 'rxjs';

export interface Producto {
  id?: string;
  nombre: string;
  marca: string;
  modelo: string;
  imagenUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class InventarioService {
  constructor(private firestore: Firestore, private storage: Storage) {}

  // ✅ Obtener todos los productos en tiempo real
  getProductos(): Observable<Producto[]> {
    const col = collection(this.firestore, 'inventario');
    return collectionData(col, { idField: 'id' }) as Observable<Producto[]>;
  }

  // ✅ Añadir producto con imagen (si la hay)
  async addProducto(producto: Producto, imagen: File | null) {
    try {
      if (imagen) {
        const url = await this.subirImagen(imagen);
        producto.imagenUrl = url;
      }

      const col = collection(this.firestore, 'inventario');
      return await addDoc(col, producto);
    } catch (err) {
      console.error('❌ Error al añadir producto:', err);
      throw err;
    }
  }

  // ✅ Editar producto con nueva imagen (opcional)
  async updateProducto(id: string, producto: Producto, imagen: File | null) {
    try {
      const docRef = doc(this.firestore, 'inventario', id);

      if (imagen) {
        const url = await this.subirImagen(imagen);
        producto.imagenUrl = url;
      }

      return await updateDoc(docRef, {
        nombre: producto.nombre,
        marca: producto.marca,
        modelo: producto.modelo,
        imagenUrl: producto.imagenUrl
      });
    } catch (err) {
      console.error('❌ Error al actualizar producto:', err);
      throw err;
    }
  }

  // ✅ Eliminar producto por ID
  deleteProducto(id: string) {
    try {
      const docRef = doc(this.firestore, 'inventario', id);
      return deleteDoc(docRef);
    } catch (err) {
      console.error('❌ Error al eliminar producto:', err);
      throw err;
    }
  }

  // ✅ Subir imagen a Firebase Storage
  private async subirImagen(imagen: File): Promise<string> {
    try {
      const nombre = `${Date.now()}_${imagen.name}`;
      const storageRef = ref(this.storage, `imagenes/${nombre}`);
      await uploadBytes(storageRef, imagen);
      return await getDownloadURL(storageRef);
    } catch (err) {
      console.error('❌ Error al subir imagen:', err);
      throw err;
    }
  }
}
