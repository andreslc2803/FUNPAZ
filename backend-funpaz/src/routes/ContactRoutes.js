const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const contactoController = require("../controllers/ContactController");

router.post(
  "/formulario-contacto",
  upload.array("archivos"),
  contactoController.handleForm
);

module.exports = router;
