const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String, 
  threads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], 
  isAdmin: { type: Boolean, default: false } 
});

module.exports = mongoose.model('User', userSchema);