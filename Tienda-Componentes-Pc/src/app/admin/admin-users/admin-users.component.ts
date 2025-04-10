// src/app/admin/admin-users/admin-users.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, deleteDoc, doc , updateDoc, Timestamp } from '@angular/fire/firestore'; // Timestamp importado
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// RouterLink/RouterOutlet no se usan directamente en la plantilla, no son necesarios aquí
// import { RouterLink, RouterOutlet } from '@angular/router'; // No necesario si no hay <router-outlet> o routerLink aquí

// ... (interfaz Cliente) ...
export interface Cliente {
  admin: boolean;
  creado: any; // Puede ser Timestamp o Date dependiendo de cómo se guarde/lea
  direccion: string;
  email: string;
  nombre: string;
  telefono: string;
  uid: string;
}


@Component({
  selector: 'app-admin-users',
  standalone: true, // <-- AÑADIDO
  imports: [CommonModule, ReactiveFormsModule], // Añadido ReactiveFormsModule
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss' // Corregido a styleUrls si es un array
})
export class AdminUsersComponent implements OnInit {
  // ... (resto del código sin cambios aparentes necesarios) ...
  clientes$: Observable<Cliente[]>;
  selectedUser: Cliente | null = null; // Tipar correctamente
  showEditModal = false;
  editForm: FormGroup;
  private firestore = inject(Firestore);
  private clientesCollection = collection(this.firestore, 'clientes');

  constructor(private fb: FormBuilder) {
    this.clientes$ = this.cargarUsuarios(); // Llamar a cargarUsuarios
    this.editForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      admin: [false]
    });
  }

  ngOnInit(): void {
    // No es necesario cargar aquí si ya se hace en el constructor
  }

  cargarUsuarios(): Observable<Cliente[]> {
    return collectionData(this.clientesCollection, { idField: 'uid' }) as Observable<Cliente[]>;
  }

  eliminarUsuario(uid: string | undefined) { // Permitir undefined por si acaso
    if (!uid) {
      console.error('Intento de eliminar usuario sin UID');
      return;
    }
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      const clienteDocRef = doc(this.firestore, `clientes/${uid}`);
      deleteDoc(clienteDocRef)
        .then(() => {
            console.log(`Usuario con UID ${uid} eliminado correctamente.`);
            // Forzar recarga (aunque el observable debería actualizarse solo)
            this.clientes$ = this.cargarUsuarios();
        })
        .catch(error => console.error('Error al eliminar el usuario:', error));
    }
  }

  editarUsuario(user: Cliente) {
    this.selectedUser = user; // Guardar el usuario completo
    this.showEditModal = true;
    this.editForm.patchValue({
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono ?? '', // Usar '' si es null/undefined
      direccion: user.direccion ?? '', // Usar '' si es null/undefined
      admin: user.admin
    });
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedUser = null;
    this.editForm.reset(); // Resetear el formulario
  }

  saveUser() {
    if (this.editForm.invalid || !this.selectedUser?.uid) {
        console.error('Formulario inválido o usuario no seleccionado.');
        return; // Salir si el formulario no es válido o no hay usuario seleccionado
    }

      // No es necesario crear un nuevo objeto 'updatedUser' completo si solo pasamos los valores del form
      // Firestore updateDoc acepta un objeto parcial con los campos a actualizar.
      const updateData = this.editForm.value;

      const userDocRef = doc(this.firestore, `clientes/${this.selectedUser.uid}`);
      updateDoc(userDocRef, updateData) // Pasar directamente los valores del formulario
        .then(() => {
          console.log(`Usuario con UID ${this.selectedUser?.uid} actualizado correctamente.`);
          this.closeEditModal();
          // No es estrictamente necesario recargar manualmente si el observable está activo
          // this.clientes$ = this.cargarUsuarios();
        })
        .catch(error => console.error('Error al actualizar el usuario:', error));
  }


  formatDate(timestamp: any): string {
    if (!timestamp) {
        return 'Fecha no disponible'; // Devuelve un string vacío o un mensaje
    }
    try {
        // Comprueba si es un objeto Timestamp de Firestore
        if (timestamp instanceof Timestamp) {
            const date = timestamp.toDate();
            return date.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short'}); // Formato español
        }
        // Intenta tratarlo como objeto con seconds/nanoseconds (a veces viene así)
        else if (timestamp && typeof timestamp.seconds === 'number') {
             const date = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
             return date.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short'});
        }
         // Intenta crear una fecha directamente si es un string ISO u otro formato reconocible
         else {
             const date = new Date(timestamp);
             if (!isNaN(date.getTime())) { // Verifica si la fecha es válida
                 return date.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short'});
             }
         }
    } catch (e) {
        console.error("Error formateando fecha:", e, "Valor recibido:", timestamp);
        return 'Fecha inválida';
    }
    return 'Formato desconocido'; // Fallback si no se pudo formatear
  }
}
