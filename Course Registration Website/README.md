Course Registration System
A Web-Based Course Registration System for Students and Admins

Project Overview
This project is a web-based course registration system that allows students to register for courses and enables admins to manage courses, students, and seat availability. It is built using Node.js, Express.js, MongoDB, and EJS for dynamic rendering.

Features
Student Features
Student Login & Authentication
View Available Courses
Register for Courses
Override Registration (Admin Approval)

Admin Features
Admin Login & Authentication
Add, Update, and Delete Courses
Manage Students (Override Registration)
Manage Course Seats
Generate Reports

Setup

MONGO_URI=mongodb://localhost:27017/course_registration
port is used 3000


Start the Server

npm run dev
Server will run at: http://localhost:3000

Usage
Admin Login

Username: admin
Password: 12345678


Student Login
Roll Number: 22F-3727
Password: qwertyui

Tech Stack
Backend: Node.js, Express.js
Frontend: EJS, HTML, CSS, JavaScript
Database: MongoDB
Authentication: Express Sessions
GitHub Repository
[🔗 GitHub Repository](https://github.com/AsfandAhmed3/Course-Registration)