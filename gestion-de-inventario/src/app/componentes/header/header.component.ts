import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { FirebaseService } from '../../services/firebase/firebase.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  modoLogin = true;
    //Variable donde guardamos el usuario logeado
  usuarioLogueado: User | null = null; 

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    // Escucha de cambios en la autentificación con Firebase
    this.firebaseService.currentUser.subscribe(user => {
      this.usuarioLogueado = user;
    });
  }

  mostrarAuth(esLogin: boolean){
    this.modoLogin = esLogin;
  }

  cambiarModo(esLogin: boolean){
    this.modoLogin = esLogin;
  }

  manejarLogin(usuario: any) {
    this.usuarioLogueado = usuario;
  }
  
  cerrarSesion() {
    this.usuarioLogueado = null;
  }
}
