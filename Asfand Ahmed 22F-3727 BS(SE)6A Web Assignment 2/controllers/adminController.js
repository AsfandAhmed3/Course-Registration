const Course = require('../models/Course');
const Student = require('../models/student');

exports.getDashboard = async (req, res) => {
  try {
    res.render('admin/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading admin dashboard.");
  }
};

exports.getStudentRegistrations = async (req, res) => {
  try {
    const Student = require('../models/student');
    const students = await Student.find({});
    res.json({ success: true, students });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error fetching student registrations." });
  }
};

exports.getStudentRegistrations = async (req, res) => {
  try {
    const students = await Student.find({});
    res.json({ success: true, students });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error fetching student registrations." });
  }
};

exports.addOrUpdateCourse = async (req, res) => {
  try {
    const { courseName, courseCode, seatsAvailable, prerequisites, department, courseLevel, schedule } = req.body;
    let course = await Course.findOne({ courseCode });

    if (course) {
      course.courseName = courseName;
      course.seatsAvailable = seatsAvailable;
      course.prerequisites = prerequisites ? prerequisites.split(',').map(p => p.trim()) : [];
      course.department = department;
      course.courseLevel = courseLevel;
      course.schedule = schedule;
      await course.save();
      res.json({ success: true, message: "Course updated." });
    } else {
      course = new Course({
        courseName,
        courseCode,
        seatsAvailable,
        prerequisites: prerequisites ? prerequisites.split(',').map(p => p.trim()) : [],
        department,
        courseLevel,
        schedule
      });
      await course.save();
      res.json({ success: true, message: "Course added." });
    }
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error adding/updating course." });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.json({ success: true, message: "Course deleted." });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error deleting course." });
  }
};

exports.overrideStudentRegistration = async (req, res) => {
  try {
    const { studentRoll, courseCode } = req.body;
    const student = await Student.findOne({ rollNumber: studentRoll });
    const course = await Course.findOne({ courseCode });
    if (!student || !course) {
      return res.json({ success: false, message: "Student or Course not found." });
    }
    if (!student.schedule.includes(course._id)) {
      student.schedule.push(course._id);
      await student.save();
      return res.json({ success: true, message: "Registration overridden; course added." });
    } else {
      return res.json({ success: false, message: "Student already registered for this course." });
    }
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error overriding registration." });
  }
};

exports.updateSeatCount = async (req, res) => {
  try {
    const { courseCode, newSeatCount } = req.body;
    const course = await Course.findOne({ courseCode });
    if (course) {
      course.seatsAvailable = newSeatCount;
      await course.save();
      res.json({ success: true, message: "Seat count updated." });
    } else {
      res.json({ success: false, message: "Course not found." });
    }
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error updating seat count." });
  }
};

exports.deleteCourseByCode = async (req, res) => {
  try {
    const { courseCode } = req.params;
    const course = await Course.findOneAndDelete({ courseCode });
    if (!course) {
      return res.json({ success: false, message: "Course not found." });
    }
    res.json({ success: true, message: `Course '${courseCode}' deleted successfully.` });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error deleting course." });
  }
};

exports.getReportStudents = async (req, res) => {
  try {
    const { courseCode } = req.query;
    const course = await Course.findOne({ courseCode });
    if (!course) return res.json({ success: false, message: "Course not found." });
    
    const students = await Student.find({ schedule: course._id });
    res.json({ success: true, report: students });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error fetching report." });
  }
};

exports.getReportAvailableCourses = async (req, res) => {
  try {
    const courses = await Course.find({ seatsAvailable: { $gt: 0 } });
    res.json({ success: true, report: courses });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error fetching report." });
  }
};

exports.getReportMissingPrerequisites = async (req, res) => {
  try {
    const students = await Student.find().populate('schedule');
    let report = [];

    students.forEach(student => {
      student.schedule.forEach(course => {
        let missing = course.prerequisites.filter(prereq => {
          return !student.schedule.some(c => c.courseCode === prereq);
        });
        if (missing.length > 0) {
          report.push({
            student: student.rollNumber,
            course: course.courseCode,
            missingPrerequisites: missing
          });
        }
      });
    });

    res.json({ success: true, report });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error fetching report." });
  }
};
