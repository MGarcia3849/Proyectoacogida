import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
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
    private router: Router
  ) {}

  register(): void {
    this.error = '';
    this.success = '';

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.authService.register(
      this.email,
      this.password,
      this.nombre,
      this.telefono,
      this.direccion
    ).subscribe({
      next: () => {
        this.success = 'Usuario registrado correctamente.';
        this.router.navigate(['/']);
      },
      error: (err: any) => this.error = err.message
    });
  }
}
