import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosService, Producto } from '../../core/services/productos.service';
import { EMPTY, Observable } from 'rxjs';
import { AdminProductFormComponent } from '../admin-product-form/admin-product-form.component'; 

@Component({
  selector: 'app-admin-product-list',
  imports: [ CommonModule, AdminProductFormComponent ],
  templateUrl: './admin-product-list.component.html',
  styleUrl: './admin-product-list.component.scss',
  standalone: true
})
export class AdminProductListComponent implements OnInit {

  productos$: Observable<Producto[]>  = EMPTY;
  showList = true;
  showForm = false;
  isEditing = false;
  selectedProduct: any = null;

  constructor(private productosService: ProductosService) { }

  ngOnInit(): void {
    this.productos$ = this.productosService.getProductos();
  }

  showProductForm(productToEdit?: any) {
    this.showList = false;
    this.showForm = true;
    this.isEditing = !!productToEdit; // Si se pasa un producto, estamos editando
    this.selectedProduct = productToEdit || {}; // Pasa el producto a editar o un objeto vacío para crear
  }

  onProductSaved() {
    this.showForm = false;
    this.showList = true;
    this.selectedProduct = null;
    this.productos$ = this.productosService.getProductos(); //Se recargan los productos
  }

  onFormCancelled() {
    this.showForm = false;
    this.showList = true;
    this.selectedProduct = null;
  }

  iniciarEdicion(product: any) { //Inicia la edición del producto seleccionado
    this.showProductForm(product);
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

}
