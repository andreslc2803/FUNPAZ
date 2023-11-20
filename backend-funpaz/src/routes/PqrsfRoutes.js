const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const pqrsfController = require("../controllers/PqrsfController");

router.post(
  "/formulario-pqrsf",
  upload.array("archivos"),
  pqrsfController.handleForm
);

module.exports = router;
