import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService, Producto } from '../../core/services/productos.service';
import { Observable, of, switchMap, Subscription, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators'; // Import map operator
import { CartService } from '../../core/services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private productosService = inject(ProductosService);
  private cartService = inject(CartService);
  private router = inject(Router);

  producto$: Observable<Producto | null> | undefined;  // Change type to Producto | null
  private subscription: Subscription | undefined;

  ngOnInit(): void {
    this.producto$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          return of(null);
        }
        return this.productosService.getProductoById(id).pipe(
          catchError(error => {
            console.error('Error fetching product:', error);
            Swal.fire('Error', 'No se pudo cargar el producto.', 'error');
            return throwError(error); // Propagate the error
          }),
          map(product => product || null) // Explicitly convert undefined to null
        );
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  volverATienda() {
    this.router.navigate(['/']);
  }

  agregarAlCarrito(producto: Producto | null) {  // Change type to Producto | null
    if (producto) {
      this.cartService.agregarProducto(producto);

      Swal.fire({
        title: '¡Producto Agregado!',
        text: `${producto.nombre} se ha añadido al carrito.`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      Swal.fire('Advertencia', 'No se puede agregar un producto inexistente.', 'warning');

    }
  }
}
