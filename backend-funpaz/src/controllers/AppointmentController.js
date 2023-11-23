/**
 * Maneja la solicitud de formularios de citas.
 *
 * @module controllers/appointmentController
 */

/**
 * Importa el servicio de citas para procesar la información del formulario.
 *
 * @constant {Object} citaService
 */
const citaService = require("../services/AppointmentService");

/**
 * Maneja la solicitud de formularios de citas, procesa la información del formulario y archivos adjuntos.
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

    // Procesar el formulario utilizando el servicio de citas
    citaService.processForm(formulario, archivosAdjuntos);

    // Responder con éxito
    res.status(200).send();
  } catch (error) {
    // Manejar errores internos del servidor y responder con un mensaje de error
    console.error("Error interno del servidor", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
