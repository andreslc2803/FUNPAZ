/**
 * Maneja la solicitud de formularios de PQRSF.
 *
 * @module controllers/pqrsfController
 */

/**
 * Importa el servicio de PQRSF para procesar la información del formulario.
 *
 * @constant {Object} pqrsfService
 */
const pqrsfService = require("../services/PqrsfService");

/**
 * Maneja la solicitud de formularios de PQRSF, procesa la información del formulario y archivos adjuntos.
 *
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {void}
 */
exports.handleForm = (req, res) => {
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

    // Procesar el formulario utilizando el servicio de PQRSF
    pqrsfService.processForm(formulario, archivosAdjuntos);

    // Responder con éxito
    res.status(200).send();
  } catch (error) {
    // Manejar errores internos del servidor y responder con un mensaje de error
    console.error("Error interno del servidor", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
