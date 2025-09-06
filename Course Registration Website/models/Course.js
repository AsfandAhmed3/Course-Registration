const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  courseCode: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  courseLevel: { type: Number, required: true },
  schedule: [{
    day: { 
      type: String, 
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      required: true
    },
    startTime: { type: String, required: true }, 
    endTime: { type: String, required: true }    
  }],
  seatsAvailable: { type: Number, required: true },
  prerequisites: [{ type: String }]
});

module.exports = mongoose.model('Course', courseSchema);
