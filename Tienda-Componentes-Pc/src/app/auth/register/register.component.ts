import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [CommonModule, FormsModule, RouterModule],
})
export class RegisterComponent {
  nombre = '';
  telefono = '';
  direccion = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  success = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestore: Firestore
  ) {}

  async register() {
    this.error = '';
    this.success = '';

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    try {
      const cred = await this.authService.register(this.email, this.password);
      const uid = cred.user?.uid;

      if (uid) {
        await setDoc(doc(this.firestore, 'clientes', uid), {
          nombre: this.nombre,
          telefono: this.telefono,
          direccion: this.direccion,
          email: this.email,
          uid: uid,
          creado: new Date()
        });

        this.success = '¡Registro exitoso!';
        setTimeout(() => this.router.navigate(['/home']), 1500);
      }
    } catch (err: any) {
      this.error = err.message;
    }
  }
}
