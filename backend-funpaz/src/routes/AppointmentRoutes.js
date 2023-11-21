const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const citaController = require("../controllers/AppointmentController");
const reCaptchaMiddleware = require("../middleware/RecaptchaMiddleware");

router.post(
  "/formulario-cita",
  reCaptchaMiddleware,
  upload.array("archivos"),
  citaController.handleForm
);

module.exports = router;
