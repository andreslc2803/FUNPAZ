const nodemailer = require("nodemailer");

/**
 * Configura y envía un correo electrónico con los datos del formulario.
 * @param {object} formulario - Objeto que contiene los datos del formulario.
 * @param {object} archivoAdjunto - Opcional. Objeto que representa el archivo adjunto.
 */
module.exports = (formulario, archivoAdjunto) => {
  // Configura el transporte de correo utilizando el servicio de Gmail.
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "andrescarvajal2803londono@gmail.com", // Cambialo por tu email
      pass: "ehlu jjnp fndg qnyr", // Cambialo por tu contraseña o token de aplicación (se pide desde google)
    },
  });

  /**
   * Estructura del cuerpo del mensaje que va a llegar al correo electrónico.
   */
  const mailOptions = {
    from: `'${formulario.nombre}' <${formulario.correo}>`,
    to: "andrescarvajal2803londono@gmail.com", // Cambia esta parte por el destinatario
    subject: "MENSAJE FORMULARIO CONTACTO",
    html: `
      <h1>CONTACTO</h1>
      <strong>Nombre(s):</strong> ${formulario.nombre} <br/>
      <strong>Apellidos:</strong> ${formulario.apellido} <br/>
      <strong>E-mail:</strong> ${formulario.correo} <br/>
      <strong>Descripción del mensaje:</strong> ${formulario.descripcion}
    `
  };

  // Verifica si hay un archivo adjunto y lo agrega a las opciones del correo.
  if (archivoAdjunto) {
    mailOptions.attachments = [
      {
        filename: archivoAdjunto.originalname,
        content: archivoAdjunto.buffer,
      },
    ];
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
