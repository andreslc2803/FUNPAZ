/**
 * Módulo para el servicio de manejo de formularios de citas.
 *
 * @module services/AppointmentService
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
 * Función para procesar el formulario de citas y enviar un correo electrónico con la información proporcionada.
 *
 * @function
 * @name processForm
 * @param {Object} formulario - Datos del formulario de citas.
 * @param {Array} archivosAdjuntos - Archivos adjuntos al formulario.
 * @throws {Error} Se lanza un error si ocurre algún problema durante el envío del correo electrónico.
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
    subject: "MENSAJE FORMULARIO CITA",
    html: `
      <h1>CITA</h1>
      <strong>Tipo documento: </strong> ${formulario.tipo_documento} <br/>
      <strong>Numero documento: </strong> ${formulario.numero} <br/>
      <strong>Nombre(s): </strong> ${formulario.nombre} <br/>
      <strong>Apellidos: </strong> ${formulario.apellido} <br/>
      <strong>E-mail: </strong> ${formulario.correo} <br/>
      <strong>Teléfono: </strong><a href="https://wa.me/57${formulario.telefono}" target="_blank">
      ${formulario.telefono}</a><br/>
      <strong>EPS: </strong> ${formulario.tipo_eps} <br/>
      <strong>Descripción de la cita: </strong> ${formulario.descripcion}
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
      throw new Error("Error al enviar el correo electrónico.");
    } else {
      console.log("Información : " + info);
    }
  });
};
