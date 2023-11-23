/**
 * Módulo para el servicio de manejo de solicitudes de PQRSF (Peticiones, Quejas, Reclamos, Sugerencias y Felicitaciones).
 *
 * @module services/PqrsfService
 */

/**
 * Importa el módulo nodemailer para el envío de correos electrónicos.
 *
 * @constant {Object} nodemailer
 */
const nodemailer = require("nodemailer");

/**
 * Importa las variables de configuración de correo electrónico desde el archivo de configuración.
 *
 * @constant {string} EMAIL - Dirección de correo electrónico del remitente y destinatario.
 * @constant {string} APPLICATION_PASSWORD_GOOGLE - Contraseña de la aplicación de Google utilizada para el envío de correos.
 */
const { EMAIL, APPLICATION_PASSWORD_GOOGLE } = require("../config/config");

/**
 * Función para procesar la solicitud de PQRSF y enviar un correo electrónico de notificación.
 *
 * @function
 * @name processForm
 * @param {Object} formulario - Datos del formulario de PQRSF.
 * @param {Array} archivosAdjuntos - Archivos adjuntos a la solicitud.
 */
exports.processForm = (formulario, archivosAdjuntos) => {
  /**
   * Crea un objeto transporter de nodemailer para enviar correos electrónicos a través del servicio de Gmail.
   *
   * @constant {Object} transporter
   */
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: APPLICATION_PASSWORD_GOOGLE,
    },
  });

  /**
   * Configuración de opciones del correo electrónico.
   *
   * @constant {Object} mailOptions
   */
  const mailOptions = {
    from: `'${formulario.nombre}' <${formulario.correo}>`,
    to: EMAIL, // Cambia esta parte por el destinatario
    subject: `${formulario.tipo_pqrs} - MENSAJE FORMULARIO PQRS`,
    html: `
      <h1>${formulario.tipo_pqrs}</h1>
      <strong>Tipo documento: </strong> ${formulario.tipo_documento} <br/>
      <strong>Numero documento: </strong> ${formulario.numero} <br/>
      <strong>Nombre(s): </strong> ${formulario.nombre} <br/>
      <strong>Apellidos: </strong> ${formulario.apellido} <br/>
      <strong>E-mail: </strong> ${formulario.correo} <br/>
      <strong>Teléfono: </strong><a href="https://wa.me/57${formulario.telefono}" target="_blank">
      ${formulario.telefono}</a><br/>
      <strong>Descripción de la PQRSF: </strong> ${formulario.descripcion}
    `,
  };

  /**
   * Adjunta archivos al correo electrónico si hay archivos adjuntos.
   */
  if (archivosAdjuntos && archivosAdjuntos.length > 0) {
    mailOptions.attachments = archivosAdjuntos.map((adjunto) => ({
      filename: adjunto.originalname,
      content: adjunto.buffer,
    }));
  }

  /**
   * Envía el correo electrónico utilizando el transporter de nodemailer y maneja errores.
   */
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.error("ERROR : " + err);
    } else {
      console.log("Información : " + info);
    }
  });
};
