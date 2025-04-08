import { Component } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { httpsCallable } from '@angular/fire/functions';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Functions } from '@angular/fire/functions'; // Importar para llamar a las funciones de Firebase

@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.component.html',
  styleUrls: ['./soporte.component.scss'],
  imports: [ FormsModule, CommonModule, RouterModule ],
  standalone: true
})
export class SoporteComponent {
  motivo: string = '';
  descripcion: string = '';
  email: string = ''; // Nuevo campo para el email del cliente

  constructor(
    private firestore: Firestore,
    private functions: Functions // Inyectamos Firebase Functions
  ) {}

  enviarIncidencia() {
    if (this.motivo && this.descripcion && this.email) {
      const incidencia = {
        motivo: this.motivo,
        descripcion: this.descripcion,
        email: this.email,  // Añadimos el email de la incidencia
        fecha: new Date(),
        estado: 'pendiente', // Estado de la incidencia
      };

      // Guardar la incidencia en Firestore
      const incidenciasRef = collection(this.firestore, 'incidencias');
      addDoc(incidenciasRef, incidencia).then(docRef => {
        // Llamar a la función de Firebase para enviar el correo
        const enviarCorreo = httpsCallable(this.functions, 'enviarCorreo');
        enviarCorreo({
          incidenciaId: docRef.id,
          incidencia
        }).then(response => {
          console.log('Correo enviado exitosamente:', response);
        }).catch(error => {
          console.error('Error al enviar correo:', error);
        });
      }).catch(error => {
        console.error('Error al guardar incidencia:', error);
      });
    }
  }
}
