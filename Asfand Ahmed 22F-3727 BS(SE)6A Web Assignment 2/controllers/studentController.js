const Student = require('../models/student');
const Course = require('../models/Course');

exports.getDashboard = async (req, res) => {
  try {
    const student = await Student.findById(req.session.user._id).populate('schedule');
    res.render('student/dashboard', { student });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading dashboard.");
  }
};

exports.addCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const student = await Student.findById(req.session.user._id);

    if (student.schedule.includes(courseId)) {
      return res.json({ success: false, message: "Course already added." });
    }

    student.schedule.push(courseId);
    await student.save();
    res.json({ success: true, message: "Course added to schedule." });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error adding course." });
  }
};

exports.removeCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const student = await Student.findById(req.session.user._id);
    student.schedule = student.schedule.filter(id => id.toString() !== courseId);
    await student.save();
    res.json({ success: true, message: "Course removed from schedule." });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error removing course." });
  }
};

exports.getScheduleJSON = async (req, res) => {
  try {
    const student = await Student.findById(req.session.user._id).populate('schedule');
    res.json({ success: true, schedule: student.schedule });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error fetching schedule." });
  }
};

exports.filterCourses = async (req, res) => {
  try {
    const { department, courseLevel, timeOfDay, days, openSeats } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (courseLevel) filter.courseLevel = courseLevel;
    if (openSeats) filter.seatsAvailable = { $gte: Number(openSeats) };

    const courses = await Course.find(filter);
    return res.json({ success: true, courses });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "Error filtering courses." });
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
