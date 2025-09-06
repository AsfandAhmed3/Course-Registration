const Student = require('../models/student');
const Admin = require('../models/Admin');

exports.getLoginPage = (req, res) => {
  res.render('auth/login', { message: null });
};

exports.postLogin = async (req, res) => {
  const { userType, username, password } = req.body;
  console.log("Login attempt:", userType, username, password);

  if (userType === 'student') {
    const student = await Student.findOne({ rollNumber: username });
    if (student && student.password === password) { // Fix password check
      console.log("Student login successful");
      req.session.user = student;
      req.session.userType = 'student';
      return res.redirect('/student/dashboard');
    } else {
      console.log("Invalid student credentials");
      return res.render('auth/login', { message: 'Invalid student credentials.' });
    }
  } else if (userType === 'admin') {
    const admin = await Admin.findOne({ username: username });
    if (admin && admin.password === password) { // Fix password check
      console.log("Admin login successful");
      req.session.user = admin;
      req.session.userType = 'admin';
      return res.redirect('/admin/dashboard');
    } else {
      console.log("Invalid admin credentials");
      return res.render('auth/login', { message: 'Invalid admin credentials.' });
    }
  } else {
    return res.render('auth/login', { message: 'Invalid user type.' });
  }
};


exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
};
