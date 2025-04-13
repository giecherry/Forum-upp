const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  maxLength: {
    type: Number,
    default: 500,
  },
  minLength: {
    type: Number,
    default: 1,
  },
}
, {
  timestamps: true,
});

module.exports = mongoose.model('Comment', commentSchema);