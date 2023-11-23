/**
 * Middleware para validar reCaptcha en las solicitudes.
 *
 * @module middleware/recaptchaMiddleware
 */

/**
 * Importa el cliente HTTP axios para realizar solicitudes.
 *
 * @constant {Object} axios
 */
const axios = require("axios");

/**
 * Importa la clave secreta del reCaptcha desde la configuración.
 *
 * @constant {string} SECRET_KEY
 */
const { SECRET_KEY } = require("../config/config");

/**
 * Middleware que valida el reCaptcha en las solicitudes.
 *
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware en la cadena de ejecución.
 * @returns {void}
 */
const recaptchaMiddleware = async (req, res, next) => {
  try {
    // Obtener el token del encabezado de autorización
    const token = req.header("Authorization");
    if (!token) {
      throw new Error("El token está vacío o es inválido");
    }

    // Extraer el token de formato "Bearer {token}"
    const tokenParts = token.split(" ");
    const recaptchaToken = tokenParts[1];

    // Realizar la solicitud al servicio de reCaptcha para validar el token
    const url = "https://www.google.com/recaptcha/api/siteverify";
    const response = await axios.post(
      url,
      null,
      {
        params: {
          secret: SECRET_KEY,
          response: recaptchaToken,
          remoteip: req.connection.remoteAddress,
        },
      }
    );

    const data = response.data;

    // Verificar el resultado de la validación del reCaptcha
    if (!data.success) {
      throw new Error("La validación del reCaptcha no tuvo éxito");
    }

    // Agregar información sobre el éxito de la validación al objeto de solicitud
    req.recaptcha = {
      success: true,
      message: "Recaptcha aprobado",
    };

    // Pasar al siguiente middleware
    next();
  } catch (error) {
    // Manejar errores y responder con un mensaje de error
    console.error("Error:", error.message);
    res.status(400).send({ success: false, message: error.message });
  }
};

/**
 * Exporta el middleware para su uso en otras partes de la aplicación.
 *
 * @exports
 */
module.exports = recaptchaMiddleware;
