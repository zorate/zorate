const multer = require('multer');

const ALLOWED_TYPES = {
  'image/jpeg':      'jpg',
  'image/png':       'png',
  'image/gif':       'gif',
  'image/webp':      'webp',
  'image/svg+xml':   'svg',
  'video/mp4':       'mp4',
  'video/webm':      'webm',
  'application/pdf': 'pdf',
};

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`File type "${file.mimetype}" is not allowed`), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter,
});

module.exports = { upload, ALLOWED_TYPES };