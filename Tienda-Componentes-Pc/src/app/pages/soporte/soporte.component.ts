import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Firestore, collection, addDoc, doc, setDoc } from '@angular/fire/firestore';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-soporte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './soporte.component.html',
  styleUrls: ['./soporte.component.scss']
})
export class SoporteComponent {
  functions = inject(Functions);
  firestore = inject(Firestore);

  incidencia = {
    email: '',
    motivo: '',
    descripcion: ''
  };

  enviarSolicitud() {
    const enviarCorreo = httpsCallable(this.functions, 'enviarCorreo');

    const incidenciaData = {
      email: this.incidencia.email,
      motivo: this.incidencia.motivo,
      descripcion: this.incidencia.descripcion,
      fecha: new Date().toISOString()
    };

    const incidenciasRef = collection(this.firestore, 'incidencias');

    addDoc(incidenciasRef, incidenciaData).then(docRef => {
      const incidenciaId = docRef.id;
      const incidenciaConId = { ...incidenciaData, id: incidenciaId };

      const incidenciaDocRef = doc(this.firestore, 'incidencias', incidenciaId);
      setDoc(incidenciaDocRef, incidenciaConId).then(() => {
        enviarCorreo({
          incidenciaId: incidenciaId,
          incidencia: incidenciaConId
        }).then(() => {
          Swal.fire({
            title: '¡Solicitud Enviada!',
            text: 'Tu solicitud de soporte se ha enviado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }).catch(() => {
          Swal.fire({
            title: '¡Error!',
            text: 'Hubo un error al enviar tu solicitud.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        });
      }).catch(() => {
        Swal.fire({
          title: '¡Error!',
          text: 'Hubo un error al guardar tu solicitud.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      });
    }).catch(() => {
      Swal.fire({
        title: '¡Error!',
        text: 'Hubo un error al guardar tu solicitud.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
  }
}
