const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Use the controller

router.get('/login', authController.getLoginPage);

router.post('/login', authController.postLogin);

router.get('/logout', authController.logout);

module.exports = router;
