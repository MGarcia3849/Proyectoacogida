import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, Usuario } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuarioForm!: FormGroup;
  rolForm!: FormGroup;
  cargando = false;
  error = '';
  mensaje = '';
  editandoUsuario: Usuario | null = null;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rol: ['user', Validators.required]
    });

    this.rolForm = this.fb.group({
      rol: ['user', Validators.required]
    });

    this.auth.getAllUsers().subscribe(users => {
      this.usuarios = users;
    });
  }

  async crearUsuario() {
    if (this.usuarioForm.invalid) return;
    const { email, password, rol } = this.usuarioForm.value;
    this.cargando = true;
    this.error = '';
    this.mensaje = '';

    try {
      await this.auth.register(email, password, rol);
      this.usuarioForm.reset({ rol: 'user' });
      this.mensaje = '✅ Usuario creado correctamente';
    } catch (err) {
      console.error(err);
      this.error = '❌ Error al crear usuario';
    } finally {
      this.cargando = false;
    }
  }

  editarUsuario(usuario: Usuario) {
    this.editandoUsuario = usuario;
    this.rolForm.patchValue({ rol: usuario.rol });
  }

  async guardarCambios() {
    if (!this.editandoUsuario || this.rolForm.invalid) return;

    const nuevoRol = this.rolForm.value.rol;

    try {
      await this.auth.saveUser(this.editandoUsuario.uid, this.editandoUsuario.email, nuevoRol);
      this.mensaje = 'Rol actualizado correctamente';
      this.editandoUsuario = null;
    } catch (err) {
      console.error('❌ Error al actualizar usuario:', err);
      this.error = '❌ Error al actualizar el rol';
    }
  }

  cancelarEdicion() {
    this.editandoUsuario = null;
  }

  eliminarUsuario(uid: string) {
    if (confirm('¿Seguro que quieres eliminar este usuario?')) {
      this.auth.deleteUser(uid).then(() => {
        this.mensaje = '🗑️ Usuario eliminado correctamente';
      }).catch(err => {
        console.error(err);
        this.error = '❌ Error al eliminar usuario';
      });
    }
  }

  logout() {
    this.auth.logout().then(() => {
      localStorage.removeItem('rol');
      this.router.navigate(['/']);
    });
  }

  volver() {
    this.router.navigate(['/inicio']);
  }
}
