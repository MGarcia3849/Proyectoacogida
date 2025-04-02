import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioComponent } from './formulario/formulario.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormularioComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
