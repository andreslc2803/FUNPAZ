const nodemailer = require("nodemailer");
const { EMAIL, APPLICATION_PASSWORD_GOOGLE } = require("../config/config");

exports.processForm = (formulario, archivosAdjuntos) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: APPLICATION_PASSWORD_GOOGLE,
    },
  });

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

  if (archivosAdjuntos && archivosAdjuntos.length > 0) {
    mailOptions.attachments = archivosAdjuntos.map((adjunto) => ({
      filename: adjunto.originalname,
      content: adjunto.buffer,
    }));
  }

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.error("ERROR : " + err);
    } else {
      console.log("Información : " + info);
    }
  });
};
