const express = require('express');
const upload = require('../middleware/upload.middleware');
const pdfController = require('../controllers/pdf.controller');

const router = express.Router();

router.post(
  '/generate',
  upload.fields([
    { name: 'html_file', maxCount: 1 },
    { name: 'zip_file', maxCount: 1 }
  ]),
  pdfController.generate
);

module.exports = router;