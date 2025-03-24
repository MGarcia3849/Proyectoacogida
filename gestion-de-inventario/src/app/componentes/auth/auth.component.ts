import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  
  esLogin: boolean = true;

  @Input() modoLogin: boolean = true;
  @Output() cerrar = new EventEmitter<void>(); 

  cerrarAuth() {
    this.cerrar.emit();
  }
  
  toogleForm(){
    this.esLogin = !this.esLogin;
  }

  onSubmit(){
    console.log(this.esLogin ? 'Iniciar sesión' : 'Registrar usuario');
  }
}
