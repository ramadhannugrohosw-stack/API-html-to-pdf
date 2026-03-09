const fs = require('fs-extra');
const path = require('path');
const unzipper = require('unzipper');
const { v4: uuidv4 } = require('uuid');
const paths = require('../utils/paths');

async function extractZipAndFindEntryHtml(zipPath) {
  const extractFolderName = uuidv4();
  const extractPath = path.join(paths.extractDir, extractFolderName);

  await fs.ensureDir(extractPath);

  await fs
    .createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: extractPath }))
    .promise();

  const htmlFiles = await findHtmlFilesRecursive(extractPath);

  if (!htmlFiles.length) {
    throw new Error('ZIP tidak mengandung file HTML');
  }

  const preferred = pickBestHtmlEntry(htmlFiles);

  return preferred;
}

async function findHtmlFilesRecursive(dir) {
  const results = [];
  const items = await fs.readdir(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      const nested = await findHtmlFilesRecursive(fullPath);
      results.push(...nested);
    } else {
      const ext = path.extname(item).toLowerCase();
      if (ext === '.html' || ext === '.htm') {
        results.push(fullPath);
      }
    }
  }

  return results;
}

function pickBestHtmlEntry(htmlFiles) {
  const normalized = htmlFiles.map((file) => ({
    fullPath: file,
    lower: file.replace(/\\/g, '/').toLowerCase()
  }));

  const indexInRoot = normalized.find((f) => /\/index\.html?$/.test(f.lower));
  if (indexInRoot) return indexInRoot.fullPath;

  const mainInRoot = normalized.find((f) => /\/main\.html?$/.test(f.lower));
  if (mainInRoot) return mainInRoot.fullPath;

  return normalized[0].fullPath;
}

module.exports = {
  extractZipAndFindEntryHtml
};