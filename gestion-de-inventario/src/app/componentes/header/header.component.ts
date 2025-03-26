import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  mostrarFormulario = false;
  modoLogin = true;

  mostrarAuth(esLogin: boolean){
    this.modoLogin = esLogin;
    this.mostrarFormulario = true;
  }

  cerrarAuth(){
    this.mostrarFormulario = false;
  }
}
