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

  orden: 'asc' | 'desc' | null = null;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['categoria']) {
        this.filtros.categoria = params['categoria'];
      }

      this.aplicarFiltros();
    });

    this.productos$.subscribe(productos => {
      const categoriasUnicas = new Set(productos.map(p => p.categoria));
      this.categorias = Array.from(categoriasUnicas);

      const precios = productos.map(p => p.precio);
      this.precioMin = Math.min(...precios);
      this.precioMax = Math.max(...precios);

      if (!this.filtros.precioMin && !this.filtros.precioMax) {
        this.filtros.precioMin = this.precioMin;
        this.filtros.precioMax = this.precioMax;
      }

      this.aplicarFiltros();
    });
  }

  aplicarFiltros(): void {
    const nombreLower = this.filtros.nombre.toLowerCase().trim();

    this.productosFiltrados$ = this.productos$.pipe(
      map(productos => {
        let filtrados = productos.filter(p =>
          (!this.filtros.categoria || p.categoria === this.filtros.categoria) &&
          p.precio >= this.filtros.precioMin &&
          p.precio <= this.filtros.precioMax &&
          (!nombreLower || p.nombre.toLowerCase().includes(nombreLower))
        );

        if (this.orden === 'asc') {
          filtrados = filtrados.sort((a, b) => a.precio - b.precio);
        } else if (this.orden === 'desc') {
          filtrados = filtrados.sort((a, b) => b.precio - a.precio);
        }

        return filtrados;
      })
    );
  }

  ordenarPorPrecio(direccion: 'asc' | 'desc'): void {
    this.orden = direccion;
    this.aplicarFiltros();
  }
}
