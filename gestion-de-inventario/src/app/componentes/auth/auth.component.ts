import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  
  email: string = '';
  password: string = '';
  rol: string = '';

  @Input() modoLogin: boolean = true;
  @Output() cerrar = new EventEmitter<void>(); 
  @Output() cambiarModo = new EventEmitter<boolean>();

  constructor(private firebaseService: FirebaseService) { }

  cerrarAuth() {
    this.cerrar.emit();
  }

  toggleModo(){
    this.modoLogin = !this.modoLogin;
    this.cambiarModo.emit(this.modoLogin);
  }

 async onSubmit() {
    if (this.modoLogin) {
      // 🔹 Iniciar sesión con Firebase Authentication
      try {
        const userCredential = await this.firebaseService.login(this.email, this.password);
        console.log('Usuario logueado:', userCredential.user);
        this.cerrarAuth();
      } catch (error) {
        console.error('Error al iniciar sesión:', (error as Error).message);
      }
      
    } else {
      // 🔹 Registrar usuario
      if (!this.email || !this.password || !this.rol) {
        console.log('Por favor, rellene todos los campos');
        return;
      }

      try {
        const userCredential = await this.firebaseService.register(this.email, this.password);
        const user = userCredential.user;
        
        // 🔹 Guardar datos del usuario en Firestore (sin contraseña)
        await this.firebaseService.addUsuario({
          email: user.email!,
          uid: user.uid,
          rol: this.rol
        });

        console.log('Usuario registrado exitosamente');
        this.cerrarAuth();
      } catch (error) {
        console.error('Error al registrar usuario:', (error as Error).message);
      }
    }
  }
}
