const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { detectInputType } = require('./input.service');
const { extractZipAndFindEntryHtml } = require('./zip.service');
const {
  renderPdfFromHtml,
  renderPdfFromUrl,
  renderPdfFromFile
} = require('./render.service');
const paths = require('../utils/paths');

async function generatePdf(req) {
  const inputType = detectInputType(req);
  const outputFileName = `${uuidv4()}.pdf`;
  const outputPath = path.join(paths.outputDir, outputFileName);

  if (inputType === 'html') {
    await renderPdfFromHtml(req.body.html, outputPath);
  } else if (inputType === 'html_base64') {
    const html = Buffer.from(req.body.html_base64, 'base64').toString('utf-8');
    await renderPdfFromHtml(html, outputPath);
  } else if (inputType === 'url') {
    await renderPdfFromUrl(req.body.url, outputPath);
  } else if (inputType === 'html_file') {
    const htmlFile = req.files.html_file[0];
    await renderPdfFromFile(htmlFile.path, outputPath);
  } else if (inputType === 'zip_file') {
    const zipFile = req.files.zip_file[0];
    const entryHtmlPath = await extractZipAndFindEntryHtml(zipFile.path);
    await renderPdfFromFile(entryHtmlPath, outputPath);
  } else {
    throw new Error('Input tidak dikenali');
  }

  return {
    inputType,
    outputFileName,
    outputPath
  };
}

module.exports = {
  generatePdf
};