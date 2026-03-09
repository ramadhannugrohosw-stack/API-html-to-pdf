const path = require('path');
const env = require('../config/env');

const rootDir = process.cwd();

module.exports = {
  rootDir,
  tempDir: path.join(rootDir, env.tempDir),
  extractDir: path.join(rootDir, env.extractDir),
  outputDir: path.join(rootDir, env.outputDir)
};