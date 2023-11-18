const express = require("express");
const cors = require("cors");
const request = require("request");
const bodyParser = require("body-parser");

const formularioContacto = require("./FomularioContacto");
const formularioCita = require("./FormularioCita");
const formularioPqrs = require("./FormularioPqrs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/token_validate", (req, res) => {
  let token = req.body.recaptcha;
  //Clave secreta del reCaptcha https://www.google.com/recaptcha/admin/site/684742025
  const secretKey = "6LeJVdAoAAAAABYBB-Qvoej2p0O3UYwtiGqRkWlN";

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}&remoteip=${req.connection.remoteAddress}`;

  if (token === null || token === undefined) {
    res
      .status(400)
      .send({ success: false, message: "El token está vacío o es inválido" });
    return console.error("Token vacío");
  }
  res.send({ success: true, message: "Recaptcha aprobado" });
});

app.post("/formulario-contacto", upload.array("archivos"), (req, res) => {
  try {
    const formulario = req.body;
    const archivosAdjuntos = req.files;

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

    formularioContacto(formulario, archivosAdjuntos);
    res.status(200).send();
  } catch (error) {
    console.error("Error interno del servidor", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/formulario-cita", upload.array("archivos"), (req, res) => {
  try {
    const formulario = req.body;
    const archivosAdjuntos = req.files;

    if (
      !formulario.tipo_documento ||
      !formulario.numero ||
      !formulario.nombre ||
      !formulario.apellido ||
      !formulario.correo ||
      !formulario.descripcion
    ) {
      return res
        .status(400)
        .json({ error: "Por favor, complete todos los campos obligatorios." });
    }

    formularioCita(formulario, archivosAdjuntos);
    res.status(200).send();
  } catch (error) {
    console.error("Error interno del servidor", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/formulario-pqrs", upload.array("archivos"), (req, res) => {
  try {
    const formulario = req.body;
    const archivosAdjuntos = req.files;

    if (!formulario.tipo_pqrs || !formulario.descripcion) {
      return res
        .status(400)
        .json({ error: "Por favor, complete todos los campos obligatorios." });
    }

    formularioPqrs(formulario, archivosAdjuntos);
    res.status(200).send();
  } catch (error) {
    console.error("Error interno del servidor", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.listen(PORT, () => {
  console.log("Servidor corriendo en el puerto", PORT);
});
