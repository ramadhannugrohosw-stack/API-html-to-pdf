require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT || 3000),
  appName: process.env.APP_NAME || 'html-pdf-api',
  nodeEnv: process.env.NODE_ENV || 'development',
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB || 50),
  tempDir: process.env.TEMP_DIR || 'storage/tmp',
  extractDir: process.env.EXTRACT_DIR || 'storage/extracted',
  outputDir: process.env.OUTPUT_DIR || 'storage/output'
};