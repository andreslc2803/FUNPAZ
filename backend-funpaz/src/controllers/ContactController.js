const contactoService = require("../services/ContactService");

exports.handleForm = (req, res) => {
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
    contactoService.processForm(formulario, archivosAdjuntos);
    res.status(200).send();
    
  } catch (error) {
    // Manejar errores internos del servidor y responder con un mensaje de error
    console.error("Error interno del servidor", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
