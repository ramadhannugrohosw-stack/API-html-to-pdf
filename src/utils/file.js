const fs = require('fs-extra');

async function ensureDir(dirPath) {
  await fs.ensureDir(dirPath);
}

async function ensureDirs(dirPaths = []) {
  for (const dir of dirPaths) {
    await fs.ensureDir(dir);
  }
}

module.exports = {
  ensureDir,
  ensureDirs
};