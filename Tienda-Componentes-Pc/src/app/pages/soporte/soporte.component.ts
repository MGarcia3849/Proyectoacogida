import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Firestore, collection, addDoc, doc, setDoc } from '@angular/fire/firestore'; // Importamos Firestore
import Swal from 'sweetalert2'; // Importamos SweetAlert2

@Component({
  selector: 'app-soporte',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './soporte.component.html',
})
export class SoporteComponent {
  functions = inject(Functions);
  firestore = inject(Firestore);  // Inyectamos Firestore para guardado en la base de datos

  incidencia = {
    email: '',
    motivo: '',
    descripcion: ''
  };

  enviarSolicitud() {
    const enviarCorreo = httpsCallable(this.functions, 'enviarCorreo');
    
    // Creamos la incidencia con los datos del formulario
    const incidenciaData = {
      email: this.incidencia.email,
      motivo: this.incidencia.motivo,
      descripcion: this.incidencia.descripcion,
      fecha: new Date().toISOString()
    };

    // Guardamos la incidencia en Firestore
    const incidenciasRef = collection(this.firestore, 'incidencias');
    addDoc(incidenciasRef, incidenciaData).then(docRef => {
      // Aquí obtenemos el ID generado por Firestore
      const incidenciaId = docRef.id;

      // Agregamos el ID al objeto de la incidencia
      const incidenciaConId = {
        ...incidenciaData,
        id: incidenciaId  // Agregamos el ID al objeto de la incidencia
      };

      // Usamos setDoc para asegurarnos de que el documento se actualice con el ID en Firestore
      const incidenciaDocRef = doc(this.firestore, 'incidencias', incidenciaId);
      setDoc(incidenciaDocRef, incidenciaConId).then(() => {
        console.log('Incidencia guardada con ID:', incidenciaId);

        // Ahora enviamos el correo con el ID generado por Firestore
        enviarCorreo({
          incidenciaId: incidenciaId,  // Usamos el ID generado por Firestore
          incidencia: incidenciaConId  // Enviamos la incidencia con el ID agregado
        }).then(result => {
          console.log('Correo enviado:', result);
          
          // Mostrar el popup de SweetAlert2 en caso de éxito
          Swal.fire({
            title: '¡Solicitud Enviada!',
            text: 'Tu solicitud de soporte se ha enviado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        }).catch(error => {
          console.error('Error al enviar correo:', error);

          // Mostrar el popup de SweetAlert2 en caso de error
          Swal.fire({
            title: '¡Error!',
            text: 'Hubo un error al enviar tu solicitud.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        });
      }).catch(error => {
        console.error('Error al guardar incidencia:', error);

        // Mostrar el popup de SweetAlert2 en caso de error al guardar en Firestore
        Swal.fire({
          title: '¡Error!',
          text: 'Hubo un error al guardar tu solicitud.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      });
    }).catch(error => {
      console.error('Error al guardar incidencia:', error);

      // Mostrar el popup de SweetAlert2 en caso de error al guardar en Firestore
      Swal.fire({
        title: '¡Error!',
        text: 'Hubo un error al guardar tu solicitud.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
  }
}
