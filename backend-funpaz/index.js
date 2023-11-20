// Importación de los módulos necesarios
const express = require("express");
const cors = require("cors");
const axios = require("axios");

// Configuración de la aplicación Express
const app = express();

// Configuración de middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Importar archivo de configuración
const { SERVER_PORT, SECRET_KEY } = require("./src/config/config");

// Importar rutas
const contactoRoutes = require("./src/routes/ContactRoutes");
const citaRoutes = require("./src/routes/AppointmentRoutes");
const pqrsfRoutes = require("./src/routes/PqrsfRoutes");

// Ruta para verificar la validez de un token reCAPTCHA
app.post("/token_validate", async (req, res) => {
  try {
    const token = req.body.recaptcha;

    if (!token) {
      throw new Error("El token está vacío o es inválido");
    }

    const url = "https://www.google.com/recaptcha/api/siteverify";
    const response = await axios.post(url, null, {
      params: {
        secret: SECRET_KEY,
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

// Usar las rutas
app.use("/api", contactoRoutes);
app.use("/api", citaRoutes);
app.use("/api", pqrsfRoutes);

// Configuración del servidor para escuchar en el puerto especificado
app.listen(SERVER_PORT, () => {
  console.log(`Server running on http://localhost:${SERVER_PORT}`);
});
