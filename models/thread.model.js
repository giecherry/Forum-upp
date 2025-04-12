const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
  title: String,
  content: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},
{
  timestamps: true,
});

module.exports = mongoose.model('Thread', threadSchema);