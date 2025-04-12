const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: String,
  thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}
, {
  timestamps: true,
});

module.exports = mongoose.model('Comment', commentSchema);