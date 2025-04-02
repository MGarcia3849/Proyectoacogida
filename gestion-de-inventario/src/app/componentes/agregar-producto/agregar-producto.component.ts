import { Component, EventEmitter, Output } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-agregar-producto',
  standalone: false,
  templateUrl: './agregar-producto.component.html',
  styleUrl: './agregar-producto.component.scss'
})
export class AgregarProductoComponent{

  @Output() productoAgregado = new EventEmitter<void>();

  producto = {
    nombre: '',
    descripcion: '',
    cantidad: 0
  }

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {}

  async onSubmit() {
    try {
      await this.firebaseService.addProducto(this.producto);
      
      const agregarProductoModal = document.getElementById('agregarProductoModal') as HTMLElement;
      if (agregarProductoModal) {
        let modalBootstrap = Modal.getInstance(agregarProductoModal);
        if (!modalBootstrap) {
          modalBootstrap = new Modal(agregarProductoModal);
        }
        modalBootstrap.hide();
      }

      this.productoAgregado.emit();
      console.log('Producto agregado exitosamente');
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  }
}
