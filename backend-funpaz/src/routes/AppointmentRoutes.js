const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const citaController = require("../controllers/AppointmentController");

router.post(
  "/formulario-cita",
  upload.array("archivos"),
  citaController.handleForm
);

module.exports = router;
