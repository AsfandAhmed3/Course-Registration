const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String }
});

module.exports = mongoose.model('Admin', adminSchema);
