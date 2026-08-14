const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename:     { type: String, required: true },
  originalName: { type: String },
  gridfsId:     { type: mongoose.Schema.Types.ObjectId, required: true },
  mimeType:     { type: String, required: true },
  size:         { type: Number },
  width:        { type: Number },
  height:       { type: Number },
  duration:     { type: Number },
  altText:      { type: String, default: '' },
  caption:      { type: String, default: '' },
}, { timestamps: true });

// Virtual URL — resolved at request time
mediaSchema.virtual('url').get(function() {
  return `/api/media/${this._id}/file`;
});

mediaSchema.set('toJSON', { virtuals: true });
mediaSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Media', mediaSchema);