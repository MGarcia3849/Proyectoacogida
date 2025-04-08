import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { ProductosService, Producto } from '../../core/services/productos.service';

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  private productosService = inject(ProductosService);
  productos$: Observable<Producto[]> = this.productosService.getProductos();
  productosFiltrados$: Observable<Producto[]> = this.productos$;

  filtros = {
    nombre: '',
    categoria: '',
    precioMin: 0,
    precioMax: 0
  };

  categorias: string[] = [];
  precioMin = 0;
  precioMax = 0;

  constructor() {
    this.productos$.subscribe(productos => {
      // Obtener categorías únicas
      const categoriasUnicas = new Set(productos.map(p => p.categoria));
      this.categorias = Array.from(categoriasUnicas);

      // Calcular rangos de precios
      const precios = productos.map(p => p.precio);
      this.precioMin = Math.min(...precios);
      this.precioMax = Math.max(...precios);

      // Establecer valores iniciales
      this.filtros.precioMin = this.precioMin;
      this.filtros.precioMax = this.precioMax;
    });
  }

  aplicarFiltros() {
    const nombreLower = this.filtros.nombre.toLowerCase().trim();

    this.productosFiltrados$ = this.productos$.pipe(
      map(productos =>
        productos.filter(p =>
          (!this.filtros.categoria || p.categoria === this.filtros.categoria) &&
          p.precio >= this.filtros.precioMin &&
          p.precio <= this.filtros.precioMax &&
          (!nombreLower || p.nombre.toLowerCase().includes(nombreLower))
        )
      )
    );
  }
}
