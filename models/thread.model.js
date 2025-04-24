const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  maxlength: {
    type: Number,
    default: 1000,
  }
},
{
  timestamps: true,
});


module.exports = mongoose.model('Thread', threadSchema);