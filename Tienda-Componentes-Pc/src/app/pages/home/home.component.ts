import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductosService, Producto } from '../../core/services/productos.service';
import { Observable, map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private productosService = inject(ProductosService);

  ofertas$: Observable<Producto[]> = this.productosService.getProductos().pipe(
    map(productos => productos.filter(p => p.oferta))
  );
}
