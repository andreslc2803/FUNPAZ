/**
 * Maneja la solicitud de formularios de historias clínicas.
 *
 * @module controllers/historyController
 */

/**
 * Importa el servicio de historias clínicas para procesar la información del formulario.
 *
 * @constant {Object} historiaService
 */
const historiaService = require("../services/HistoryService");

/**
 * Maneja la solicitud de formularios de historias clínicas, procesa la información del formulario y archivos adjuntos.
 *
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {void}
 */
exports.handleForm = (req, res) => {
  try {
    // Obtener archivos adjuntos
    const archivosAdjuntos = req.files;

    // Verificar la presencia de archivos adjuntos en la solicitud
    if (!archivosAdjuntos) {
      return res
        .status(400)
        .json({ error: "Por favor, adjunte los archivos." });
    }

    // Si se llega a este punto, significa que hay archivos adjuntos
    historiaService.processForm(archivosAdjuntos);

    // Responder con éxito
    res.status(200).send();
  } catch (error) {
    // Manejar errores internos del servidor y responder con un mensaje de error
    console.error("Error interno del servidor", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
