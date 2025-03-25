import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  cargando = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // 🔐 Login con email y contraseña
  async login() {
    if (this.loginForm.invalid) return;

    this.cargando = true;
    this.errorMsg = '';

    try {
      const { email, password } = this.loginForm.value;
      const res = await this.auth.login(email!, password!);
      const uid = res.user.uid;

      const userDoc = await this.auth.getUser(uid);
      let rol = userDoc.exists() ? userDoc.data()?.rol : null;

      if (!rol) {
        rol = 'user';
        await this.auth.saveUser(uid, email!, rol);
      }

      localStorage.setItem('rol', rol);
      console.log('✅ Login exitoso, redirigiendo...');
      this.router.navigate(['/inicio']); // 👉 redirección correcta
    } catch (err) {
      console.error('❌ Error en login:', err);
      this.errorMsg = 'Correo o contraseña incorrectos';
    } finally {
      this.cargando = false;
    }
  }

  // 🔐 Login con Google
  async loginGoogle() {
    this.cargando = true;
    this.errorMsg = '';

    try {
      const res = await this.auth.loginWithGoogle();
      const uid = res.user.uid;
      const email = res.user.email!;

      const userDoc = await this.auth.getUser(uid);
      let rol = userDoc.exists() ? userDoc.data()?.rol : null;

      if (!rol) {
        rol = 'user';
        await this.auth.saveUser(uid, email, rol);
      }

      localStorage.setItem('rol', rol);
      console.log('✅ Login con Google exitoso, redirigiendo...');
      this.router.navigate(['/inicio']);
    } catch (err) {
      console.error('❌ Error en login con Google:', err);
      this.errorMsg = 'Error al iniciar sesión con Google';
    } finally {
      this.cargando = false;
    }
  }
}
