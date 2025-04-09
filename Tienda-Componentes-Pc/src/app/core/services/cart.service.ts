import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cart = new BehaviorSubject<any[]>([]);
  cart$ = this.cart.asObservable();

  agregarProducto(producto: any) {
    const productosActuales = this.cart.getValue();
    this.cart.next([...productosActuales, producto]);
  }

  obtenerCarrito() {
    return this.cart$;
  }

  vaciarCarrito() {
    this.cart.next([]);
  }
}
