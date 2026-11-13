// server/models/Snippet.js
const mongoose = require('mongoose');

const SnippetSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  files: [
    {
      name: { type: String, required: true }, 
      language: { type: String, required: true },
      value: { type: String, default: "" }
    }
  ],
  isPublic: { type: Boolean, default: false }, // Changed default to false for privacy
  // --- NEW FIELDS FOR FORKING ---
  isForked: { type: Boolean, default: false },
  parentSnippetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Snippet', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Snippet', SnippetSchema);