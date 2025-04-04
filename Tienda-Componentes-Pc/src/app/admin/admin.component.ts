import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminProductListComponent } from './admin-product-list/admin-product-list.component';
import { AdminProductFormComponent } from './admin-product-form/admin-product-form.component';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, AdminProductListComponent, AdminProductFormComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  standalone: true
})
export class AdminComponent implements OnInit {
  showList: boolean = true;
  showForm: boolean = false;
  isEditing: boolean = false;
  selectedProduct: any = null;

  constructor() { }

  ngOnInit(): void {
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
  }

  onFormCancelled() {
    this.showForm = false;
    this.showList = true;
    this.selectedProduct = null;
  }

  editProduct(product: any) { //Inicia la edición del producto seleccionado
    this.showProductForm(product);
  }
}
