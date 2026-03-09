const { generatePdf } = require('../services/pdf.service');
const { validatePdfRequest } = require('../validators/pdf.validator');
const { success, fail } = require('../utils/response');

async function generate(req, res, next) {
  try {
    const validation = validatePdfRequest(req);

    if (!validation.valid) {
      return fail(res, validation.message, 422);
    }

    const result = await generatePdf(req);

    return success(
      res,
      {
        input_type: result.inputType,
        file_name: result.outputFileName,
        file_path: result.outputPath
      },
      'PDF berhasil dibuat'
    );
  } catch (err) {
    next(err);
  }
}

module.exports = {
  generate
};