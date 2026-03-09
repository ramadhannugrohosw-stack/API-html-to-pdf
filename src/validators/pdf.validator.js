function validatePdfRequest(req) {
  const hasHtml = !!req.body.html;
  const hasBase64 = !!req.body.html_base64;
  const hasUrl = !!req.body.url;

  const hasHtmlFile =
    req.files &&
    Array.isArray(req.files.html_file) &&
    req.files.html_file.length > 0;

  const hasZipFile =
    req.files &&
    Array.isArray(req.files.zip_file) &&
    req.files.zip_file.length > 0;

  const totalInputs = [
    hasHtml,
    hasBase64,
    hasUrl,
    hasHtmlFile,
    hasZipFile
  ].filter(Boolean).length;

  if (totalInputs === 0) {
    return {
      valid: false,
      message: 'Harus kirim salah satu: html, html_base64, url, html_file, atau zip_file'
    };
  }

  if (totalInputs > 1) {
    return {
      valid: false,
      message: 'Kirim hanya satu jenis input per request'
    };
  }

  return { valid: true };
}

module.exports = {
  validatePdfRequest
};