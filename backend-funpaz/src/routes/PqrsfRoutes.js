const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const pqrsfController = require("../controllers/PqrsfController");
const reCaptchaMiddleware = require("../middleware/RecaptchaMiddleware");

router.post(
  "/formulario-pqrsf",
  reCaptchaMiddleware,
  upload.array("archivos"),
  pqrsfController.handleForm
);

module.exports = router;
