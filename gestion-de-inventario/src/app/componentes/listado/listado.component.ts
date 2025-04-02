import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-listado',
  standalone: false,
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.scss'
})
export class ListadoComponent implements OnInit {
  // Almacén de productos
  productos: any[] = [];
  esAdministrador: boolean = false;
  productoSeleccionado: any = {};

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.verificarRolUsuario();
    this.recargarProductos();
    // Verificar si el usuario es administrador
    this.firebaseService.currentUser.subscribe((user) => {

      if (user && user.rol === 'administrador') {
        this.esAdministrador = true;
      }

    });
  }

  verificarRolUsuario(): void {
    this.firebaseService.currentUser.subscribe(async (user) => {
      if (user) {
        const usuarios = await this.firebaseService.getUsuarios();
        const usuarioEncontrado = usuarios.find(u => u.email === user.email);
        this.esAdministrador = usuarioEncontrado?.rol === 'administrador';
      }
    });
  }

  abrirAgregarProducto(): void {
    const agregarProductoModal = document.getElementById('agregarProductoModal') as HTMLElement;
    if (agregarProductoModal) {
      const modalBootstrap = new Modal(agregarProductoModal);
      modalBootstrap.show(); // Mostrar el modal para agregar producto
    }
  }

  abrirEditarProducto(producto: any): void {
    this.productoSeleccionado = { ...producto }; // Se clona el producto y se modifica a parte del original
  }

  async eliminarProducto(id: string): Promise<void> {
    await this.firebaseService.deleteProducto(id);
    this.recargarProductos();
  }

  recargarProductos(): void {
    this.firebaseService.getProductos().then((productos) => {
      this.productos = productos;
    });
  }
}
