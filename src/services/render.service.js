const { chromium } = require('playwright');
const { pathToFileURL } = require('url');

async function renderPdfFromHtml(html, outputPath) {
  const browser = await chromium.launch({
    headless: true
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'networkidle'
    });

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true
    });
  } finally {
    await browser.close();
  }
}

async function renderPdfFromUrl(url, outputPath) {
  const browser = await chromium.launch({
    headless: true
  });

  try {
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true
    });
  } finally {
    await browser.close();
  }
}

async function renderPdfFromFile(htmlFilePath, outputPath) {
  const browser = await chromium.launch({
    headless: true
  });

  try {
    const page = await browser.newPage();
    const fileUrl = pathToFileURL(htmlFilePath).href;

    await page.goto(fileUrl, {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true
    });
  } finally {
    await browser.close();
  }
}

module.exports = {
  renderPdfFromHtml,
  renderPdfFromUrl,
  renderPdfFromFile
};