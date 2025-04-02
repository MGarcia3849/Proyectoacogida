import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Modal } from 'bootstrap';
import { FirebaseService } from '../../services/firebase/firebase.service';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.scss',
  standalone: false
})
export class EditarProductoComponent {
  @Input() producto: any = {}; // Recibe el producto a editar
  @Output() productoEditado = new EventEmitter<void>(); // Emitirá evento tras edición

  private modalInstance: Modal | null = null;

  constructor(private firebaseService: FirebaseService) {}

  abrirModal(): void {
    const modalElement = document.getElementById('editarProductoModal');
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);
      this.modalInstance.show();
    }
  }

  cerrarModal(): void {
    this.modalInstance?.hide();
  }

  async guardarEdicion(): Promise<void> {
    if (this.producto.id) {
      await this.firebaseService.updateProducto(this.producto.id, {
        nombre: this.producto.nombre,
        descripcion: this.producto.descripcion,
        cantidad: this.producto.cantidad
      });
      this.productoEditado.emit(); // Se notifica al padre Listado
      this.cerrarModal();
    }
  }
}

