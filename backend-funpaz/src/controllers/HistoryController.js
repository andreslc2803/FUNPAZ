const historiaService = require("../services/HistoryService");

exports.handleForm = (req, res) => {
  try {
    // Obtener datos del formulario y archivos adjuntos
    const archivosAdjuntos = req.files;

    // Verificar la presencia de campos obligatorios en el formulario
    if (!archivosAdjuntos ) {
      return res
        .status(400)
        .json({ error: "Por favor, adjunte los archivos." });
    }

    // Si se llega a este punto, significa que hay archivos adjuntos
    historiaService.processForm(archivosAdjuntos);
    res.status(200).send();
  } catch (error) {
    // Manejar errores internos del servidor y responder con un mensaje de error
    console.error("Error interno del servidor", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
