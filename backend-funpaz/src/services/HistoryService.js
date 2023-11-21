const nodemailer = require("nodemailer");
const { EMAIL, APPLICATION_PASSWORD_GOOGLE } = require("../config/config");

exports.processForm = (archivosAdjuntos) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: APPLICATION_PASSWORD_GOOGLE,
    },
  });

  const mailOptions = {
    from: `'${EMAIL}' <${EMAIL}>`,
    to: EMAIL, // Cambia esta parte por el destinatario
    subject: `SOLICITUD HISTORIA CLÍNICA`,
    html: `
      <strong>Se adjunto la historia clinica </strong> 
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
