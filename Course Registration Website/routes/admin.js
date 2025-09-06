const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const isAdminAuthenticated = require('../middleware/adminAuth');
router.use(isAdminAuthenticated);
router.get('/dashboard', adminController.getDashboard);
router.post('/courses', adminController.addOrUpdateCourse);
router.delete('/courses/:id', adminController.deleteCourse);

router.get('/students', adminController.getStudentRegistrations);

router.post('/students/override', adminController.overrideStudentRegistration);

router.put('/courses/:id/seats', adminController.updateSeatCount);

router.get('/reports/students', adminController.getReportStudents);
router.get('/reports/available-courses', adminController.getReportAvailableCourses);
router.get('/reports/missing-prerequisites', adminController.getReportMissingPrerequisites);

module.exports = router;
