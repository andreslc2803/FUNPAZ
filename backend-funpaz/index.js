// Importación de los módulos necesarios
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");

// Importación de funciones relacionadas con formularios
const formularioContacto = require("./FomularioContacto");
const formularioCita = require("./FormularioCita");
const formularioPqrs = require("./FormularioPqrs");

// Configuración de la aplicación Express
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Configuración de middleware para permitir solicitudes desde cualquier origen (CORS)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de multer para el manejo de archivos adjuntos en formularios
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * Ruta para verificar la validez de un token reCAPTCHA utilizando la API de Google reCAPTCHA.
 * Responde con un mensaje indicando si la validación fue exitosa o no.
 */
app.post("/token_validate", async (req, res) => {
  try {
    // Obtener el token reCAPTCHA del cuerpo de la solicitud
    const token = req.body.recaptcha;
    const secretKey = "6LeJVdAoAAAAABYBB-Qvoej2p0O3UYwtiGqRkWlN";

    // Verificar si el token está presente
    if (!token) {
      throw new Error("El token está vacío o es inválido");
    }

    // Configuración de la URL de verificación de reCAPTCHA
    const url = "https://www.google.com/recaptcha/api/siteverify";

    // Realizar una solicitud POST a la API de Google reCAPTCHA para verificar el token
    const response = await axios.post(url, null, {
      params: {
        secret: secretKey,
        response: token,
        remoteip: req.connection.remoteAddress,
      },
    });

    // Obtener los datos de la respuesta
    const data = response.data;

    // Si la validación no fue exitosa, lanzar un error
    if (!data.success) {
      throw new Error("La validación del reCaptcha no tuvo éxito");
    }

    // Responder con un mensaje de éxito
    res.send({ success: true, message: "Recaptcha aprobado" });
  } catch (error) {
    // Manejar cualquier error y responder con un mensaje de error
    console.error("Error:", error.message);
    res.status(400).send({ success: false, message: error.message });
  }
});

/**
 * Ruta para manejar el formulario de contacto.
 */
app.post("/formulario-contacto", upload.array("archivos"), (req, res) => {
  try {
    // Obtener datos del formulario y archivos adjuntos
    const formulario = req.body;
    const archivosAdjuntos = req.files;

    // Verificar la presencia de campos obligatorios en el formulario
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

    // Llamar a la función relacionada con el formulario de contacto
    formularioContacto(formulario, archivosAdjuntos);
    // Responder con un código de estado 200 (OK)
    res.status(200).send();
  } catch (error) {
    // Manejar errores internos del servidor y responder con un mensaje de error
    console.error("Error interno del servidor", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * Ruta para manejar el formulario de cita.
 */
app.post("/formulario-cita", upload.array("archivos"), (req, res) => {
  try {
    // Obtener datos del formulario y archivos adjuntos
    const formulario = req.body;
    const archivosAdjuntos = req.files;

    // Verificar la presencia de campos obligatorios en el formulario
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

    // Llamar a la función relacionada con el formulario de cita
    formularioCita(formulario, archivosAdjuntos);
    // Responder con un código de estado 200 (OK)
    res.status(200).send();
  } catch (error) {
    // Manejar errores internos del servidor y responder con un mensaje de error
    console.error("Error interno del servidor", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * Ruta para manejar el formulario de PQRS (Procedimientos, Quejas, Reclamos y Sugerencias).
 */
app.post("/formulario-pqrs", upload.array("archivos"), (req, res) => {
  try {
    // Obtener datos del formulario y archivos adjuntos
    const formulario = req.body;
    const archivosAdjuntos = req.files;

    // Verificar la presencia de campos obligatorios en el formulario
    if (!formulario.tipo_pqrs || !formulario.descripcion) {
      return res
        .status(400)
        .json({ error: "Por favor, complete todos los campos obligatorios." });
    }

    // Llamar a la función relacionada con el formulario de PQRS
    formularioPqrs(formulario, archivosAdjuntos);
    // Responder con un código de estado 200 (OK)
    res.status(200).send();
  } catch (error) {
    // Manejar errores internos del servidor y responder con un mensaje de error
    console.error("Error interno del servidor", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Configuración del servidor para escuchar en el puerto especificado
app.listen(PORT, () => {
  console.log("Servidor corriendo en el puerto", PORT);
});
