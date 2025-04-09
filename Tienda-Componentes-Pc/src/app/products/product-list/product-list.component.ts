import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, map } from 'rxjs';

import { ProductosService, Producto } from '../../core/services/productos.service';

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  private productosService = inject(ProductosService);
  private route = inject(ActivatedRoute);

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

  ngOnInit(): void {
    // Leer query params
    this.route.queryParams.subscribe(params => {
      if (params['categoria']) {
        this.filtros.categoria = params['categoria'];
      }

      this.aplicarFiltros(); // Aplicar con la categoría si viene de home
    });

    // Obtener datos y preparar filtros
    this.productos$.subscribe(productos => {
      // Categorías únicas
      const categoriasUnicas = new Set(productos.map(p => p.categoria));
      this.categorias = Array.from(categoriasUnicas);

      // Rango de precios
      const precios = productos.map(p => p.precio);
      this.precioMin = Math.min(...precios);
      this.precioMax = Math.max(...precios);

      // Si no hay valores ya definidos (por query param), asignar por defecto
      if (!this.filtros.precioMin && !this.filtros.precioMax) {
        this.filtros.precioMin = this.precioMin;
        this.filtros.precioMax = this.precioMax;
      }

      this.aplicarFiltros(); // Reaplicar cuando se cargan los productos
    });
  }

  aplicarFiltros(): void {
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
