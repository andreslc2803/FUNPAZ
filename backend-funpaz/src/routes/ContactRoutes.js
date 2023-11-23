/**
 * Enrutador para gestionar las rutas relacionadas con el formulario de contacto.
 *
 * @module routes/contactRoutes
 */

/**
 * Importa el framework Express para crear rutas.
 *
 * @constant {Object} express
 */
const express = require("express");

/**
 * Crea un objeto de enrutador Express.
 *
 * @constant {Object} router
 */
const router = express.Router();

/**
 * Importa la biblioteca multer para el manejo de archivos en las solicitudes.
 *
 * @constant {Object} multer
 */
const multer = require("multer");

/**
 * Inicializa la configuración de multer para la carga de archivos.
 *
 * @constant {Object} upload
 */
const upload = multer();

/**
 * Importa el controlador de contacto para manejar las solicitudes relacionadas con el formulario de contacto.
 *
 * @constant {Object} contactoController
 */
const contactoController = require("../controllers/ContactController");

/**
 * Importa el middleware reCaptcha para validar el reCaptcha en las solicitudes.
 *
 * @constant {Object} reCaptchaMiddleware
 */
const reCaptchaMiddleware = require("../middleware/RecaptchaMiddleware");

/**
 * Ruta POST para el formulario de contacto. Utiliza el middleware de reCaptcha y multer para manejar la carga de archivos.
 *
 * @function
 * @name POST/formulario-contacto
 * @param {string} path - Ruta de la solicitud.
 * @param {function} middleware - Middleware de reCaptcha para validar la solicitud.
 * @param {function} middleware - Middleware multer para manejar la carga de archivos.
 * @param {function} handler - Controlador para manejar la lógica de la solicitud.
 */
router.post(
  "/formulario-contacto",
  reCaptchaMiddleware,
  upload.array("archivos"),
  contactoController.handleForm
);

/**
 * Exporta el enrutador para su uso en otras partes de la aplicación.
 *
 * @exports
 */
module.exports = router;
