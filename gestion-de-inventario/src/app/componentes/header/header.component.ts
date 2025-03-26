import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  modoLogin = true;
  usuarioLogueado: any = null; //Variable donde guardamos el usuario logeado

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
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
