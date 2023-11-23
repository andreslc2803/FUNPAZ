/**
 * Módulo para el servicio de manejo de solicitudes de historias clínicas.
 *
 * @module services/HistoryService
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
 * Función para procesar la solicitud de historia clínica y enviar un correo electrónico de notificación.
 *
 * @function
 * @name processForm
 * @param {Array} archivosAdjuntos - Archivos adjuntos a la solicitud.
 */
exports.processForm = (archivosAdjuntos) => {
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
    from: `'${EMAIL}' <${EMAIL}>`,
    to: EMAIL, // Cambia esta parte por el destinatario
    subject: `SOLICITUD HISTORIA CLÍNICA`,
    html: `
      <strong>Se adjuntó la historia clínica.</strong> 
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
