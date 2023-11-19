const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");

const formularioContacto = require("./FomularioContacto");
const formularioCita = require("./FormularioCita");
const formularioPqrs = require("./FormularioPqrs");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/token_validate", async (req, res) => {
  try {
    const token = req.body.recaptcha;
    const secretKey = "6LeJVdAoAAAAABYBB-Qvoej2p0O3UYwtiGqRkWlN";

    if (!token) {
      throw new Error("El token está vacío o es inválido");
    }

    const url = "https://www.google.com/recaptcha/api/siteverify";

    const response = await axios.post(url, null, {
      params: {
        secret: secretKey,
        response: token,
        remoteip: req.connection.remoteAddress,
      },
    });

    const data = response.data;

    if (!data.success) {
      throw new Error("La validación del reCaptcha no tuvo éxito");
    }

    res.send({ success: true, message: "Recaptcha aprobado" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).send({ success: false, message: error.message });
  }
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
