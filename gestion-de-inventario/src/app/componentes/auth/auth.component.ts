import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { Modal } from 'bootstrap';

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
    console.log("Cerrando modal..."); //Depuración
    const authModal = document.getElementById('authModal') as HTMLElement;
    if (authModal) {
      const modalBootstrap = Modal.getInstance(authModal);
      modalBootstrap?.hide();
    }
    document.querySelector('.modal-backdrop')?.remove();
  }

  toggleModo(){
    this.modoLogin = !this.modoLogin;
    this.cambiarModo.emit(this.modoLogin);
  }

 async onSubmit() {
    if (this.modoLogin) {
      try {
        const userCredential = await this.firebaseService.login(this.email, this.password);
        console.log('Usuario logueado:', userCredential.user);
        this.cerrarAuth(); // Cierra el popup
      } catch (error) {
        console.error('Error al iniciar sesión:', (error as Error).message);
      }
      
    } else {
      if (!this.email || !this.password || !this.rol) {
        console.log('Por favor, rellene todos los campos');
        return;
      }

      try {
        const userCredential = await this.firebaseService.register(this.email, this.password);
        const user = userCredential.user;
        
        // Guarda datos menos la password por seguridad
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
