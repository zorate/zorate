const mongoose = require('mongoose');
const { getGridFSBucket } = require('../db');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { ALLOWED_TYPES } = require('../middleware/upload');

async function uploadToGridFS(buffer, originalName, mimeType) {
  const bucket = getGridFSBucket();
  const ext = ALLOWED_TYPES[mimeType] || path.extname(originalName).slice(1) || 'bin';
  const filename = `${uuidv4()}.${ext}`;

  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: { originalName, mimeType },
    });

    uploadStream.on('finish', () => resolve({ gridfsId: uploadStream.id, filename }));
    uploadStream.on('error', reject);
    uploadStream.end(buffer);
  });
}

async function deleteFromGridFS(gridfsId) {
  try {
    const bucket = getGridFSBucket();
    await bucket.delete(new mongoose.Types.ObjectId(gridfsId));
  } catch (err) {
    console.error('GridFS delete error:', err.message);
  }
}

async function streamFromGridFS(res, gridfsId, mimeType) {
  try {
    const bucket = getGridFSBucket();
    const id = new mongoose.Types.ObjectId(String(gridfsId));
    const downloadStream = bucket.openDownloadStream(id);

    downloadStream.on('error', (err) => {
      if (!res.headersSent) res.status(404).json({ error: 'File not found' });
    });

    if (mimeType) res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    downloadStream.pipe(res);
  } catch (err) {
    if (!res.headersSent) res.status(404).json({ error: 'File not found' });
  }
}

module.exports = { uploadToGridFS, deleteFromGridFS, streamFromGridFS };