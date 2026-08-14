const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  slug:             { type: String, required: true, unique: true, trim: true },
  title:            { type: String, required: true, trim: true },
  tagline:          { type: String, trim: true },
  shortDescription: { type: String },
  content:          { type: String }, // Markdown case study
  role:             { type: String },
  status:           { type: String, enum: ['production', 'development', 'archived'], default: 'development' },
  stack:            [{ type: String }],
  tags:             [{ type: String }],
  links: {
    github: String,
    live:   String,
    demo:   String,
  },
  coverMediaId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
  featured:         { type: Boolean, default: false },
  sortOrder:        { type: Number, default: 0 },
  publishedAt:      { type: Date },
  metrics: {
    users:   String,
    vendors: String,
    gmv:     String,
    note:    String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);