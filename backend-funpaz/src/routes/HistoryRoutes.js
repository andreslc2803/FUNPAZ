const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const historyController = require("../controllers/HistoryController");
const reCaptchaMiddleware = require("../middleware/RecaptchaMiddleware");

router.post(
  "/formulario-historia",
  reCaptchaMiddleware,
  upload.array("archivos"),
  historyController.handleForm
);

module.exports = router;
