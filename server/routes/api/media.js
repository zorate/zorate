const express = require('express');
const router = express.Router();
const Media = require('../../models/Media');
const { upload } = require('../../middleware/upload');
const { uploadToGridFS, deleteFromGridFS, streamFromGridFS } = require('../../utils/gridfs');
const { requireAuth } = require('../../middleware/auth');

let sharp;
try { sharp = require('sharp'); } catch (e) { sharp = null; }

// GET /api/media — list (admin)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 40 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      Media.find({}).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Media.countDocuments(),
    ]);
    res.json({ items, total });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// GET /api/media/:id/file — stream file (public)
router.get('/:id/file', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: 'Media not found' });
    await streamFromGridFS(res, media.gridfsId, media.mimeType);
  } catch (err) {
    if (!res.headersSent) res.status(404).json({ error: 'File not found' });
  }
});

// POST /api/media/upload — upload (admin)
router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });
  try {
    const { buffer, originalname, mimetype, size } = req.file;
    let width, height;
    if (sharp && mimetype.startsWith('image/') && mimetype !== 'image/svg+xml') {
      try { const m = await sharp(buffer).metadata(); width = m.width; height = m.height; } catch (e) {}
    }
    const { gridfsId, filename } = await uploadToGridFS(buffer, originalname, mimetype);
    const media = await Media.create({ filename, originalName: originalname, gridfsId, mimeType: mimetype, size, width, height });
    res.status(201).json({ media });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
});

// PUT /api/media/:id — update metadata (admin)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { altText, caption } = req.body;
    const media = await Media.findByIdAndUpdate(
      req.params.id, { altText: altText || '', caption: caption || '' }, { new: true }
    );
    if (!media) return res.status(404).json({ error: 'Media not found' });
    res.json({ media });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// DELETE /api/media/:id (admin)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: 'Media not found' });
    await deleteFromGridFS(media.gridfsId);
    await Media.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;