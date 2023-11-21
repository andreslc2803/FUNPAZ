const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const contactoController = require("../controllers/ContactController");
const reCaptchaMiddleware = require("../middleware/RecaptchaMiddleware");

router.post(
  "/formulario-contacto",
  reCaptchaMiddleware,
  upload.array("archivos"),
  contactoController.handleForm
);

module.exports = router;
