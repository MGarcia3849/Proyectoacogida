import * as functions from 'firebase-functions';  // Importar funciones desde Firebase
import nodemailer from 'nodemailer';  // Importar nodemailer para enviar correos
import cors from 'cors';  // Middleware CORS para permitir solicitudes de distintos orígenes
import express from 'express';  // Framework express para manejar las solicitudes HTTP

// Crear una aplicación de Express
const app = express();

// Middleware de CORS para permitir solicitudes de cualquier origen
app.use(cors({ origin: true }));

// Crear el transporte de nodemailer (usar un servicio de correo con limitaciones gratuitas si es necesario)
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Usa Gmail o puedes configurar otro servicio
  auth: {
    user: 'proyectoacogida0@gmail.com', // Reemplaza con tu correo de soporte
    pass: 'medac1234', // Utiliza la contraseña de aplicación de Gmail
  },
});

// Usamos Express para manejar las solicitudes HTTP
app.post('/enviarCorreo', (req, res) => {
  // Asegúrate de que el cuerpo de la solicitud tiene los datos correctos
  const { incidenciaId, incidencia } = req.body;

  // Verifica que la incidencia tiene los datos necesarios
  if (!incidencia || !incidencia.email || !incidencia.motivo || !incidencia.descripcion) {
    return res.status(400).send('Datos incompletos para enviar el correo');
  }

  const mailOptions = {
    from: '"Soporte" <proyectoacogida0@gmail.com>',  // Remitente
    to: incidencia.email,  // Correo del cliente
    subject: `Solicitud de soporte recibida - ID ${incidenciaId}`,  // Asunto
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
    `,
  };

  // Enviar el correo utilizando nodemailer
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error enviando el correo:', error);
      return res.status(500).send('Error al enviar correo');
    }
    return res.status(200).send('Correo enviado');
  });

  // Return a default response in case no other return statement is reached
  return res.status(500).send('Error desconocido');
});

// Exponer la función HTTP a Firebase Functions
exports.enviarCorreo = functions.https.onRequest(app);
