// Importación de los módulos necesarios para utilizar express
const express = require("express");
const cors = require("cors");

// Configuración de la aplicación Express
const app = express();

// Configuración de middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Importar archivo de configuración
const { SERVER_PORT } = require("./src/config/config");

// Importar rutas
const contactoRoutes = require("./src/routes/ContactRoutes");
const citaRoutes = require("./src/routes/AppointmentRoutes");
const pqrsfRoutes = require("./src/routes/PqrsfRoutes");
const historiaRoutes = require("./src/routes/HistoryRoutes");

// Usar las rutas
app.use("/api", contactoRoutes);
app.use("/api", citaRoutes);
app.use("/api", pqrsfRoutes);
app.use("/api", historiaRoutes);

// Configuración del servidor para escuchar en el puerto especificado
app.listen(SERVER_PORT, () => {
  console.log(`Server running on http://localhost:${SERVER_PORT}`);
});
