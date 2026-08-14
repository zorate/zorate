const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Post = require('../models/Post');
const { renderMarkdown, extractToc } = require('../utils/markdown');
const mongoose = require('mongoose');

function siteUrl(req) {
  return process.env.SITE_URL || `${req.protocol}://${req.get('host')}`;
}

// Homepage
router.get('/', async (req, res) => {
  try {
    const [featuredProjects, recentPosts] = await Promise.all([
      Project.find({ featured: true }).sort({ sortOrder: 1 }).limit(4).select('-content'),
      Post.find({ status: 'published' }).sort({ publishedAt: -1 }).limit(3).select('-content'),
    ]);
    res.render('pages/index', {
      title: 'Zor-Ate Joseph — Systems Builder',
      description: 'Backend-focused full-stack developer building practical software around APIs, data, trust, transactions, and real-world constraints.',
      path: '/', siteUrl: siteUrl(req), ogImage: siteUrl(req) + '/og-image.svg',
      projects: featuredProjects, posts: recentPosts,
    });
  } catch (err) {
    console.error(err);
    res.render('pages/index', {
      title: 'Zor-Ate Joseph — Systems Builder',
      description: 'Backend-focused full-stack developer.',
      path: '/', siteUrl: siteUrl(req), ogImage: '',
      projects: [], posts: [],
    });
  }
});

// Projects listing
router.get('/projects', async (req, res) => {
  try {
    const { tag } = req.query;
    const filter = tag ? { tags: tag } : {};
    const [projects, allTags] = await Promise.all([
      Project.find(filter).sort({ sortOrder: 1, createdAt: -1 }).select('-content'),
      Project.distinct('tags'),
    ]);
    res.render('pages/projects', {
      title: 'Projects — Zor-Ate Joseph',
      description: 'A catalog of systems, APIs, and products built by Zor-Ate Joseph.',
      path: '/projects', siteUrl: siteUrl(req), ogImage: '',
      projects, allTags, activeTag: tag || null,
    });
  } catch (err) {
    res.render('pages/projects', {
      title: 'Projects — Zor-Ate Joseph', description: '',
      path: '/projects', siteUrl: siteUrl(req), ogImage: '',
      projects: [], allTags: [], activeTag: null,
    });
  }
});

// Project detail
router.get('/projects/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) {
      return res.status(404).render('pages/404', {
        title: '404 — Zor-Ate Joseph', description: 'Project not found.',
        path: req.path, siteUrl: siteUrl(req), ogImage: '',
      });
    }
    const renderedContent = renderMarkdown(project.content);
    res.render('pages/project-detail', {
      title: `${project.title} — Zor-Ate Joseph`,
      description: project.shortDescription || project.tagline || '',
      path: `/projects/${project.slug}`, siteUrl: siteUrl(req), ogImage: '',
      project, renderedContent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('pages/404', { title: 'Error', description: '', path: req.path, siteUrl: siteUrl(req), ogImage: '' });
  }
});

// Lab listing
router.get('/lab', async (req, res) => {
  try {
    const { tag } = req.query;
    const filter = { status: 'published' };
    if (tag) filter.tags = tag;
    const [posts, allTags] = await Promise.all([
      Post.find(filter).sort({ publishedAt: -1 }).select('-content'),
      Post.distinct('tags', { status: 'published' }),
    ]);
    res.render('pages/lab', {
      title: 'The Lab — Zor-Ate Joseph',
      description: 'Engineering notes, technical breakdowns, and lessons from building real systems.',
      path: '/lab', siteUrl: siteUrl(req), ogImage: '',
      posts, allTags, activeTag: tag || null,
    });
  } catch (err) {
    res.render('pages/lab', {
      title: 'The Lab — Zor-Ate Joseph', description: '',
      path: '/lab', siteUrl: siteUrl(req), ogImage: '',
      posts: [], allTags: [], activeTag: null,
    });
  }
});

// Lab article
router.get('/lab/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, status: 'published' });
    if (!post) {
      return res.status(404).render('pages/404', {
        title: '404 — Zor-Ate Joseph', description: 'Article not found.',
        path: req.path, siteUrl: siteUrl(req), ogImage: '',
      });
    }
    const renderedContent = renderMarkdown(post.content);
    const toc = extractToc(post.content);
    res.render('pages/post-detail', {
      title: `${post.title} — The Lab`,
      description: post.excerpt || '',
      path: `/lab/${post.slug}`, siteUrl: siteUrl(req), ogImage: '',
      post, renderedContent, toc,
    });
  } catch (err) {
    res.status(500).render('pages/404', { title: 'Error', description: '', path: req.path, siteUrl: siteUrl(req), ogImage: '' });
  }
});

// About
router.get('/about', (req, res) => {
  res.render('pages/about', {
    title: 'About — Zor-Ate Joseph',
    description: 'Self-taught systems builder. I build before I fully understand, ship imperfect things, and learn by doing.',
    path: '/about', siteUrl: siteUrl(req), ogImage: '',
  });
});

// Contact
router.get('/contact', (req, res) => {
  res.render('pages/contact', {
    title: 'Contact — Zor-Ate Joseph',
    description: "Have a problem worth building? Let's talk.",
    path: '/contact', siteUrl: siteUrl(req), ogImage: '',
  });
});

// 404 catch-all
router.use((req, res) => {
  res.status(404).render('pages/404', {
    title: '404 — Zor-Ate Joseph',
    description: 'This system does not exist.',
    path: req.path, siteUrl: siteUrl(req), ogImage: '',
  });
});

module.exports = router;