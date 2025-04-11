// src/app/pages/home/home.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductosService } from '../../core/services/productos.service';
// import { Producto } from '../../core/interfaces/producto.interface'; // <-- IMPORTACIÓN ELIMINADA

// La interfaz Producto ahora se exporta desde ProductosService, pero no necesitamos
// importarla aquí explícitamente si solo la usamos para tipar el Observable,
// ya que TypeScript puede inferirlo del tipo de retorno del servicio.
// Si la necesitaras para otra cosa, podrías importarla desde el servicio:
// import { Producto } from '../../core/services/productos.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private productosService = inject(ProductosService);

  // Categorías (sin cambios)
  categorias = [
    { nombre: 'Portátiles', img: 'assets/img/portatiles.jpg' },
    { nombre: 'Ordenadores', img: 'assets/img/ordenadores.jpg' },
    { nombre: 'Monitores', img: 'assets/img/monitores.jpg' },
    { nombre: 'Gaming', img: 'assets/img/gaming.jpg' },
    { nombre: 'Componentes', img: 'assets/img/componentes.jpg' },
    { nombre: 'Accesorios', img: 'assets/img/accesorios.jpg' }
  ];

  // Observable para ofertas (no necesita el tipo explícito si se infiere)
  productosEnOferta$ = this.productosService.getOfertasDestacadas();
  // Alternativamente, si quieres el tipo explícito y la interfaz está exportada desde el servicio:
  // import { Producto } from '../../core/services/productos.service';
  // productosEnOferta$: Observable<Producto[]> = this.productosService.getOfertasDestacadas();


  // Opcional: Manejador para imágenes rotas
  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/img/placeholder.png'; // Asegúrate que esta imagen exista
  }
}
