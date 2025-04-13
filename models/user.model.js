const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  threads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], 
  isAdmin: { type: Boolean, default: false } 
});

module.exports = mongoose.model('User', userSchema);