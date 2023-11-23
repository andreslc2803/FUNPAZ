/**
 * Módulo para el servicio de manejo de formularios de contacto.
 *
 * @module services/ContactService
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
 * @constant {string} EMAIL - Dirección de correo electrónico del remitente.
 * @constant {string} APPLICATION_PASSWORD_GOOGLE - Contraseña de la aplicación de Google utilizada para el envío de correos.
 */
const { EMAIL, APPLICATION_PASSWORD_GOOGLE } = require("../config/config");

/**
 * Función para procesar el formulario de contacto y enviar un correo electrónico con la información proporcionada.
 *
 * @function
 * @name processForm
 * @param {Object} formulario - Datos del formulario de contacto.
 * @param {Array} archivosAdjuntos - Archivos adjuntos al formulario.
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
    subject: "MENSAJE FORMULARIO CONTACTO",
    html: `
      <h1>CONTACTO</h1>
      <strong>Nombre(s):</strong> ${formulario.nombre} <br/>
      <strong>Apellidos:</strong> ${formulario.apellido} <br/>
      <strong>E-mail:</strong> ${formulario.correo} <br/>
      <strong>Descripción del mensaje:</strong> ${formulario.descripcion}
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
   * Envía el correo electrónico utilizando el transporter de nodemailer.
   */
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.error("ERROR : " + err);
    } else {
      console.log("Información : " + info);
    }
  });
};
