import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  rol: string = localStorage.getItem('rol') || 'user';

  constructor(private router: Router) {}

  irA(ruta: string) {
    this.router.navigate([ruta]);
  }

  logout() {
    localStorage.removeItem('rol');
    this.router.navigate(['/']);
  }
}
