const path = require('path');
const fs = require('fs');
const { generatePdf } = require('../services/pdf.service');
const { validatePdfRequest } = require('../validators/pdf.validator');
const { fail } = require('../utils/response');

async function generate(req, res, next) {
  try {
    const validation = validatePdfRequest(req);

    if (!validation.valid) {
      return fail(res, validation.message, 422);
    }

    const result = await generatePdf(req);

    if (!fs.existsSync(result.outputPath)) {
      return fail(res, `File PDF tidak ditemukan: ${result.outputPath}`, 404);
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${path.basename(result.outputFileName)}"`
    );

    return res.sendFile(path.resolve(result.outputPath));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  generate
};