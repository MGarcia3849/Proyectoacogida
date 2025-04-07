import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Importa FormsModule
import { CommonModule } from '@angular/common';  // Importa CommonModule
import { AuthService } from '../../services/auth.service';  // Importa tu servicio de autenticación

@Component({
  selector: 'app-login',
  standalone: true,  // Usando Standalone Component
  imports: [CommonModule, FormsModule],  // Asegúrate de agregar CommonModule y FormsModule aquí
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.loading = true; // Inicia la carga
    this.authService.login(this.email, this.password)
      .then(() => {
        this.loading = false; // Detiene la carga después de un login exitoso
      })
      .catch((error) => {
        this.loading = false; // Detiene la carga en caso de error
        this.errorMessage = error.message; // Muestra el mensaje de error
      });
  }

  // Método de Login con Google (si lo implementas)
  loginWithGoogle() {
    this.loading = true; // Inicia la carga
    this.authService.loginWithGoogle()
      .then(() => {
        this.loading = false; // Detiene la carga después de un login exitoso
      })
      .catch((error) => {
        this.loading = false; // Detiene la carga en caso de error
        this.errorMessage = error.message; // Muestra el mensaje de error
      });
  }
}
