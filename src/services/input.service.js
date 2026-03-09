function detectInputType(req) {
  if (req.body.html) return 'html';
  if (req.body.html_base64) return 'html_base64';
  if (req.body.url) return 'url';

  if (req.files?.html_file?.length) return 'html_file';
  if (req.files?.zip_file?.length) return 'zip_file';

  return null;
}

module.exports = {
  detectInputType
};