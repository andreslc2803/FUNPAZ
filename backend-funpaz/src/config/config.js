/**
 * Configuración del servidor y credenciales de la aplicación.
 *
 * @module config
 */

/**
 * Puerto del servidor. Utiliza el puerto proporcionado por el entorno o el puerto 3000 por defecto.
 *
 * @constant {number} SERVER_PORT
 * @default 3000
 */
const SERVER_PORT = process.env.PORT || 3000;

/**
 * Clave secreta utilizada para diversas operaciones de seguridad.
 *
 * @constant {string} SECRET_KEY
 */
const SECRET_KEY = "6LeJVdAoAAAAABYBB-Qvoej2p0O3UYwtiGqRkWlN";

/**
 * Contraseña de la aplicación para servicios de Google.
 *
 * @constant {string} APPLICATION_PASSWORD_GOOGLE
 */
const APPLICATION_PASSWORD_GOOGLE = "ehlu jjnp fndg qnyr";

/**
 * Dirección de correo electrónico asociada a la aplicación.
 *
 * @constant {string} EMAIL
 */
const EMAIL = "andrescarvajal2803londono@gmail.com";

/**
 * Exporta las configuraciones para su uso en otros módulos.
 *
 * @exports
 */
module.exports = {
    SERVER_PORT,
    SECRET_KEY,
    APPLICATION_PASSWORD_GOOGLE,
    EMAIL
};
