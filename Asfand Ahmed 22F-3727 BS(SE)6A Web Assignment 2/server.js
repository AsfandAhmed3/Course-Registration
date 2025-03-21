require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

console.log("MONGO_URI:", process.env.MONGO_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/student', studentRoutes);

app.use((req, res, next) => {
  res.status(404).render('error', { message: 'Page not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
