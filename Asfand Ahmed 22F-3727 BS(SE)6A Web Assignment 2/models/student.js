const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true }, // Add password field
  schedule: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

module.exports = mongoose.model('Student', studentSchema);
