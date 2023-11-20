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
    subject: "MENSAJE FORMULARIO CITA", //Traer la eps seleccionada********
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
