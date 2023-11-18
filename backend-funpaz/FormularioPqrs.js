const nodemailer = require("nodemailer");

/**
 * Configura y envía un correo electrónico con los datos del formulario.
 * @param {object} formulario - Objeto que contiene los datos del formulario.
 * @param {Array} archivosAdjuntos - Array de objetos que representan los archivos adjuntos.
 */
module.exports = (formulario, archivosAdjuntos) => {
  /**
   * NOTA-> Para verificar la constraseña de aplicacion nos vamos a:
   * Administrar tu cuenta de Google -> Seguridad ->Verificación en 2 pasos -> Contraseñas de aplicaciones.
   * Despúes debemos usar esa contraseña para acceder a nuestra cuenta de Google.
   * link: https://myaccount.google.com/apppasswords?utm_source=google-account&utm_medium=myaccountsecurity&utm_campaign=tsv-settings&rapt=AEjHL4PKJGUMePCbGPzCW7IY_iwOFFRDEDYuySR9QMv5lRJAs4GPUV7MwO3P2L8VfwhjhUdhyw-xr79jZs9KiYPKsiihoEiwSH1AvikV-XZtTurBoCbNOT8
   */

  // Configura el transporte de correo utilizando el servicio de Gmail.
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "andrescarvajal2803londono@gmail.com", // Cambialo por tu email
      pass: "ehlu jjnp fndg qnyr", // Cambialo por tu contraseña de aplicacion de google (NOTA)
    },
  });

  /**
   * Estructura del cuerpo del mensaje que va a llegar al correo electrónico.
   */
  const mailOptions = {
    from: `'${formulario.nombre}' <${formulario.correo}>`,
    to: "andrescarvajal2803londono@gmail.com", // Cambia esta parte por el destinatario
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
      <strong>Descripción de la pqrs: </strong> ${formulario.descripcion}
    `,
  };

  // Verifica si hay archivos adjuntos y los agrega a las opciones del correo.
  if (archivosAdjuntos && archivosAdjuntos.length > 0) {
    mailOptions.attachments = archivosAdjuntos.map((adjunto) => ({
      filename: adjunto.originalname,
      content: adjunto.buffer,
    }));
  }

  // Envía el correo electrónico utilizando el transporte configurado.
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.error("ERROR : " + err);
    } else {
      console.log("Información : " + info);
    }
  });
};
