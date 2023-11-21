const axios = require("axios");
const { SECRET_KEY } = require("../config/config");

const recaptchaMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      throw new Error("El token está vacío o es inválido");
    }

    // Extraer el token de formato "Bearer {token}"
    const tokenParts = token.split(" ");
    const recaptchaToken = tokenParts[1];

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

    if (!data.success) {
      throw new Error("La validación del reCaptcha no tuvo éxito");
    }

    req.recaptcha = {
      success: true,
      message: "Recaptcha aprobado",
    };

    next();
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).send({ success: false, message: error.message });
  }
};

module.exports = recaptchaMiddleware;
