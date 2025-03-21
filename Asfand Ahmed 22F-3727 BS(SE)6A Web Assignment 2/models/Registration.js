const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  registrationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', registrationSchema);
