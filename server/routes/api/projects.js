const express = require('express');
const router = express.Router();
const Project = require('../../models/Project');
const { requireAuth } = require('../../middleware/auth');

function sanitize(body) {
  const allowed = ['slug','title','tagline','shortDescription','content','role',
    'status','stack','tags','links','coverMediaId','featured','sortOrder','publishedAt','metrics'];
  const data = {};
  allowed.forEach(k => { if (body[k] !== undefined) data[k] = body[k]; });
  return data;
}

// GET /api/projects — public list
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.tag) filter.tags = req.query.tag;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.featured !== undefined) filter.featured = req.query.featured === 'true';

    const projects = await Project.find(filter)
      .sort({ sortOrder: 1, createdAt: -1 })
      .select('-content');

    res.json({ projects });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// GET /api/projects/admin/all — admin list
router.get('/admin/all', requireAuth, async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ projects });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// GET /api/projects/:slug — public detail
router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// POST /api/projects — create
router.post('/', requireAuth, async (req, res) => {
  try {
    const data = sanitize(req.body);
    if (!data.slug || !data.title) return res.status(400).json({ error: 'Slug and title are required' });
    const exists = await Project.findOne({ slug: data.slug });
    if (exists) return res.status(409).json({ error: 'Slug already in use' });
    const project = await Project.create(data);
    res.status(201).json({ project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/projects/:id — update
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const data = sanitize(req.body);
    const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// DELETE /api/projects/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;