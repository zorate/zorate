require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Project = require('./models/Project');
const { connectDB } = require('./db');

async function seed() {
  try {
    await connectDB();
    console.log('Seeding database...');

    // 1. Admin
    const email = process.env.ADMIN_EMAIL || 'zoratejoseph@gmail.com';
    const password = process.env.ADMIN_PASSWORD || 'admin';
    
    let admin = await Admin.findOne({ email });
    if (!admin) {
      const passwordHash = await Admin.hashPassword(password);
      admin = await Admin.create({ email, passwordHash });
      console.log(`Created admin user: ${email}`);
    } else {
      console.log(`Admin user ${email} already exists.`);
    }

    // 2. Initial Projects (from prompt)
    const existingProjectsCount = await Project.countDocuments();
    if (existingProjectsCount === 0) {
      const kolva = {
        slug: 'kolva',
        title: 'Kolva',
        tagline: 'Multi-vendor e-commerce marketplace',
        shortDescription: 'Multi-vendor e-commerce marketplace infrastructure.',
        content: `## Architecture\n\nShowcasing the backend, payments, vendor systems, analytics, delivery logic, deployment, mobile optimization, security, and performance engineering.`,
        status: 'production',
        stack: ['Python', 'Flask', 'MongoDB', 'JavaScript', 'Paystack', 'PWA'],
        tags: ['backend', 'product', 'systems'],
        featured: true,
        sortOrder: 1,
        metrics: {
          users: '35+',
          vendors: '20+',
          gmv: '₦97k+',
          note: 'Live business'
        }
      };

      const tideScore = {
        slug: 'tidescore',
        title: 'TideScore',
        tagline: 'Rule-Based Credit System',
        shortDescription: 'Alternative credit scoring for Nigerians without formal credit history.',
        content: `## Overview\nBanks rely on records many people don’t have. TideScore explores different signals — behavior, patterns, proxies.\n\n## Technology\nPython, Flask, MongoDB, OCR, PyMuPDF, scoring logic.`,
        status: 'production',
        stack: ['Python', 'Flask', 'MongoDB', 'OCR'],
        tags: ['data', 'backend'],
        featured: true,
        sortOrder: 2
      };

      const trustCheck = {
        slug: 'trustcheck',
        title: 'TrustCheck',
        tagline: 'Trust & Relationship System',
        shortDescription: 'Trust and relationship infrastructure built around informal economies.',
        content: `## Overview\nIn many places, transactions run on trust — not formal systems. TrustCheck tracks relationships, records interactions, and exposes patterns of reliability.\n\n## Technology\nFastAPI, data modeling, reliability logic.`,
        status: 'production',
        stack: ['Python', 'FastAPI', 'HTML/CSS', 'REST API'],
        tags: ['api', 'systems'],
        featured: true,
        sortOrder: 3
      };
      
      const goalBox = {
        slug: 'goalbox',
        title: 'GoalBox',
        tagline: 'Accountability System',
        shortDescription: 'A personal commitment tracker designed to make you feel the weight of what you said you’d do.',
        content: `## Overview\nNot a habit app. Not a to-do list. Built with behavioral design in mind.`,
        status: 'production',
        stack: ['Python', 'Flask', 'Simple frontend'],
        tags: ['product'],
        featured: true,
        sortOrder: 4
      };

      await Project.insertMany([kolva, trustCheck, tideScore, goalBox]);
      console.log('Seeded initial projects.');
    } else {
      console.log('Projects already exist, skipping project seed.');
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();