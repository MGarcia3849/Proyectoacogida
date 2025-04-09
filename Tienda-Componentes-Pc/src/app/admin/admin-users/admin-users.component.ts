import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, deleteDoc, doc , updateDoc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Timestamp } from '@angular/fire/firestore';

export interface Cliente {
  admin: boolean;
  creado: Date;
  direccion: string;
  email: string;
  nombre: string;
  telefono: string;
  uid: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})

export class AdminUsersComponent implements OnInit {
  clientes$: Observable<Cliente[]>;
  selectedUser: any = null;
  showEditModal = false;
  editForm: FormGroup;
  private firestore = inject(Firestore);
  private clientesCollection = collection(this.firestore, 'clientes');

  constructor(private fb: FormBuilder) {
    this.clientes$ = collectionData(this.clientesCollection, { idField: 'uid' }) as Observable<Cliente[]>;
    this.editForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      admin: [false]
    });
  }

  ngOnInit(): void {

  }

  cargarUsuarios(): Observable<Cliente[]> {
    return collectionData(this.clientesCollection, { idField: 'uid' }) as Observable<Cliente[]>;
  }

  eliminarUsuario(uid: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      const clienteDocRef = doc(this.firestore, `clientes/${uid}`);
      deleteDoc(clienteDocRef)
        .then(() => console.log(`Usuario con UID ${uid} eliminado correctamente.`))
        .catch(error => console.error('Error al eliminar el usuario:', error));
    }
    this.clientes$ = this.cargarUsuarios();
  }

  editarUsuario(user: Cliente) {
    this.selectedUser = user;
    this.showEditModal = true;
    this.editForm.patchValue({
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono,
      direccion: user.direccion,
      admin: user.admin
    });
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedUser = null;
  }

  saveUser() {
    if (this.editForm.valid && this.selectedUser?.uid) {
      const updatedUser: Cliente = {
        uid: this.selectedUser.uid,
        ...this.editForm.value,
        creado: this.selectedUser.creado
      };
      const userDocRef = doc(this.firestore, `clientes/${this.selectedUser.uid}`);
      updateDoc(userDocRef, { ...this.editForm.value })
        .then(() => {
          console.log(`Usuario con UID ${this.selectedUser.uid} actualizado correctamente.`);
          this.closeEditModal();
          this.clientes$ = this.cargarUsuarios();
        })
        .catch(error => console.error('Error al actualizar el usuario:', error));
    }
  }

  formatDate(timestamp: any): string {
    if (timestamp) {
      const date = (timestamp instanceof Timestamp) ? timestamp.toDate() : new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    }
    return '';
  }
}