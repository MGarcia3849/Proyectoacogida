import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService, Producto } from '../../core/services/productos.service';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'app-admin-product-list',
  imports: [ CommonModule ],
  templateUrl: './admin-product-list.component.html',
  styleUrl: './admin-product-list.component.scss',
  standalone: true
})
export class AdminProductListComponent implements OnInit {

  productos$: Observable<Producto[]>  = EMPTY;
  @Output() editProduct = new EventEmitter<Producto>();

  constructor(private productosService: ProductosService) { }

  ngOnInit(): void {
    this.productos$ = this.productosService.getProductos();
  }

  eliminarProducto(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productosService.deleteProducto(id).then(() => {
        console.log(`Producto con ID ${id} eliminado correctamente.`);
      }).catch(error => {
        console.error('Error al eliminar el producto:', error);
      });
    }
  }

  iniciarEdicion(producto: Producto) {
    this.editProduct.emit(producto); // Emite el producto cuando se hace clic en "Editar"
  }

}
