const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const env = require('../config/env');
const paths = require('../utils/paths');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, paths.tempDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const allowedMimeTypes = [
  'text/html',
  'application/zip',
  'application/x-zip-compressed',
  'multipart/x-zip'
];

const upload = multer({
  storage,
  limits: {
    fileSize: env.maxFileSizeMb * 1024 * 1024
  },
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === '.html' || ext === '.htm' || ext === '.zip') {
      return cb(null, true);
    }

    if (allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(new Error('File harus berupa .html, .htm, atau .zip'));
  }
});

module.exports = upload;