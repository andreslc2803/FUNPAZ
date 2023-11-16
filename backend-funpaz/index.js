const express = require("express");
const cors = require("cors");

const request = require("request");
const bodyParser = require("body-parser");

const formularioContacto = require("./FomularioContacto");
const formularioCita = require("./FormularioCita");
const formularioPqrs = require("./FormularioPqrs");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar multer para manejar archivos adjuntos
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/token_validate", (req, res) => {
  let token = req.body.recaptcha;
  const secretKey = "6LeJVdAoAAAAABYBB-Qvoej2p0O3UYwtiGqRkWlN"; // La clave secreta de tu consola de administrador de Google;

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}&remoteip=${req.connection.remoteAddress}`;

  if (token === null || token === undefined) {
    res
      .status(400)
      .send({ success: false, message: "El token está vacío o es inválido" });
    return console.log("Token vacío");
  }
  res.send({ success: true, message: "Recaptcha aprobado" });
});

/**
 * FORMULARIO CONTACTO
 * Ruta para manejar la carga de archivos y el formulario de contacto
 */
app.post("/formulario-contacto", upload.single("archivo"), (req, res) => {
  const formulario = req.body;
  const archivoAdjunto = req.file; // El archivo adjunto se encuentra en req.file

  // Validaciones de formulario de contacto
  if (
    !formulario.nombre ||
    !formulario.apellido ||
    !formulario.correo ||
    !formulario.descripcion
  ) {
    return res
      .status(400)
      .json({ error: "Por favor, complete todos los campos obligatorios." });
  }
  // Puedes pasar tanto los datos del formulario como el archivo adjunto a configMensaje
  formularioContacto(formulario, archivoAdjunto);

  res.status(200).send();
});

/**
 * FORMULARIO CITA
 * Ruta para manejar la carga de archivos y el formulario de las citas
 */
app.post("/formulario-cita", upload.single("archivo"), (req, res) => {
  const formulario = req.body;
  const archivoAdjunto = req.file; // El archivo adjunto se encuentra en req.file

  if (
    !formulario.tipo_documento ||
    !formulario.numero ||
    !formulario.nombre ||
    !formulario.apellido ||
    !formulario.correo ||
    !formulario.descripcion
  ) {
    return res.status(400).json({
      error: "Por favor, complete todos los campos obligatorios.",
    });
  }

  // Puedes pasar tanto los datos del formulario como el archivo adjunto a configMensaje
  formularioCita(formulario, archivoAdjunto);
  res.status(200).send();
});

/**
 * FORMULARIO PQRS
 * Ruta para manejar la carga de archivos y el formulario de las pqrs
 */
app.post("/formulario-pqrs", upload.single("archivo"), (req, res) => {
  const formulario = req.body;
  const archivoAdjunto = req.file; // El archivo adjunto se encuentra en req.file

  // Validaciones de formulario de pqrs
  if (!formulario.tipo_pqrs || !formulario.descripcion) {
    return res
      .status(400)
      .json({ error: "Por favor, complete todos los campos obligatorios." });
  }

  // Puedes pasar tanto los datos del formulario como el archivo adjunto a configMensaje
  formularioPqrs(formulario, archivoAdjunto);

  res.status(200).send();
});

app.listen(3000, () => {
  console.log("Servidor corriendo");
});
