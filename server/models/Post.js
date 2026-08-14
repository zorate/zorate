const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  slug:          { type: String, required: true, unique: true, trim: true },
  title:         { type: String, required: true, trim: true },
  excerpt:       { type: String },
  content:       { type: String }, // Markdown
  coverMediaId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
  tags:          [{ type: String }],
  status:        { type: String, enum: ['draft', 'published'], default: 'draft' },
  publishedAt:   { type: Date },
  readTime:      { type: Number }, // minutes
}, { timestamps: true });

postSchema.pre('save', function(next) {
  if (this.content) {
    const wordCount = this.content.trim().split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);