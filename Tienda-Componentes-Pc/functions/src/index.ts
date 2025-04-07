import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

// Configura el transporte de correo (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'proyectoacogida0@gmial.com', // Reemplaza con tu correo de soporte
    pass: 'medac1234', // Utiliza la contraseña de aplicación de Gmail
  }
});

// Interfaz para el tipo de datos que recibirá la función
interface IncidenciaData {
  incidenciaId: string;
  incidencia: {
    email: string;
    motivo: string;
    descripcion: string;
    fecha: Date;
  };
}

// La función que maneja el correo
export const enviarCorreo = functions.https.onCall(async (data: functions.CallableRequest<IncidenciaData>, context) => {
  const { incidenciaId, incidencia } = data.data; // Accedemos a la propiedad 'data' dentro de `CallableRequest`

  const mailOptions = {
    from: '"Soporte" <tu-correo@gmail.com>',
    to: incidencia.email, // Correo del cliente
    subject: `Solicitud de soporte recibida - ID ${incidenciaId}`,
    html: `
      <p>Hola,</p>
      <p>Hemos recibido tu solicitud de soporte con el siguiente detalle:</p>
      <ul>
        <li><strong>Motivo:</strong> ${incidencia.motivo}</li>
        <li><strong>Descripción:</strong> ${incidencia.descripcion}</li>
        <li><strong>Fecha:</strong> ${new Date(incidencia.fecha).toLocaleString()}</li>
        <li><strong>ID:</strong> ${incidenciaId}</li>
      </ul>
      <p>Nos pondremos en contacto contigo pronto. ¡Gracias!</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error enviando el correo:', error);
    throw new functions.https.HttpsError('internal', 'Error enviando correo');
  }
});
