const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const { requireAuth } = require('../../middleware/auth');

function sanitize(body) {
  const allowed = ['slug','title','excerpt','content','coverMediaId','tags','status','publishedAt'];
  const data = {};
  allowed.forEach(k => { if (body[k] !== undefined) data[k] = body[k]; });
  return data;
}

// GET /api/posts — public
router.get('/', async (req, res) => {
  try {
    const { tag, limit = 20, page = 1 } = req.query;
    const filter = { status: 'published' };
    if (tag) filter.tags = tag;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [posts, total] = await Promise.all([
      Post.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(parseInt(limit)).select('-content'),
      Post.countDocuments(filter),
    ]);
    res.json({ posts, total, page: parseInt(page) });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// GET /api/posts/admin/all — admin list
router.get('/admin/all', requireAuth, async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ updatedAt: -1 }).select('-content');
    res.json({ posts });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// GET /api/posts/admin/:id — admin full post
router.get('/admin/:id', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ post });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// GET /api/posts/:slug — public detail
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, status: 'published' });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ post });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// POST /api/posts — create
router.post('/', requireAuth, async (req, res) => {
  try {
    const data = sanitize(req.body);
    if (!data.slug || !data.title) return res.status(400).json({ error: 'Slug and title are required' });
    if (data.status === 'published' && !data.publishedAt) data.publishedAt = new Date();
    const post = await Post.create(data);
    res.status(201).json({ post });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Slug already in use' });
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/posts/:id — update
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const data = sanitize(req.body);
    if (data.status === 'published') {
      const existing = await Post.findById(req.params.id);
      if (existing && !existing.publishedAt) data.publishedAt = new Date();
    }
    const post = await Post.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ post });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// DELETE /api/posts/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;