const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const isStudentAuthenticated = require('../middleware/studentAuth');

router.use(isStudentAuthenticated);

router.get('/dashboard', studentController.getDashboard);

router.post('/schedule/add', studentController.addCourse);
router.post('/schedule/remove', studentController.removeCourse);

router.get('/schedule/json', studentController.getScheduleJSON);

router.get('/courses', studentController.filterCourses);

module.exports = router;
