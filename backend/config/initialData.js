const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');
const bcrypt = require('bcrypt');

async function insertUsers() {
  await User.deleteMany({});
  const password =  await bcrypt.hash("password123", 10)
  const studentsList = [
    { email: "student1@example.com", password: password, name: "Alice", role: "student" },
    { email: "student2@example.com", password: password, name: "Bob", role: "student" },
    { email: "student3@example.com", password: password, name: "Charlie", role: "student" },
    { email: "student4@example.com", password: password, name: "David", role: "student" },
    { email: "student5@example.com", password: password, name: "Emma", role: "student" },
    { email: "professor@example.com", password: password, name: "David", role: "professor" },
  ];
  const insertedUsers = await User.insertMany(studentsList);
  console.log("Users inserted successfully!");
  return insertedUsers; 
}

async function insertCourses(students) {
  await Course.deleteMany({});

  const coursesList = [
    {
      name: "Introduction to Python",
      category: "Programming",
      price: 99.99,
      sessions: 10,
      date_start: new Date("2025-03-01"),
      date_end: new Date("2025-03-30"),
      max_slots: 50,
      current_enroll: students.map(user => ({
        studentId: user._id, 
        enrollmentDate: new Date()
      })),
      languages: ["English", "Spanish"],
      description: "Learn the basics of Python programming including variables, loops, functions, and object-oriented programming. Perfect for beginners!"
    },
    {
      name: "Advanced JavaScript",
      category: "Web Development",
      price: 149.99,
      sessions: 12,
      date_start: new Date("2025-03-05"),
      date_end: new Date("2025-03-25"),
      max_slots: 30,
      current_enroll: [], 
      languages: ["English"],
      description: "Master JavaScript with advanced concepts like closures, promises, async/await, and working with modern frameworks. Aimed at experienced developers."
    },
    {
      name: "Data Science with R",
      category: "Data Science",
      price: 199.99,
      sessions: 15,
      date_start: new Date("2025-03-01"),
      date_end: new Date("2025-03-14"),
      max_slots: 40,
      current_enroll: [], 
      languages: ["English", "French", "German"],
      description: "Explore data analysis, statistical models, and machine learning using R. This course is suitable for those with a foundation in statistics."
    },
    {
      name: "Machine Learning Basics",
      category: "Artificial Intelligence",
      price: 249.99,
      sessions: 20,
      date_start: "2025-03-01",
      date_end: "2025-03-30",
      max_slots: 5, 
      current_enroll: students.map(user => ({
        studentId: user._id, 
        enrollmentDate: new Date()
      })),
      languages: ["English", "Chinese"],
      description: "Dive into the fundamentals of machine learning, covering algorithms, data preprocessing, and practical use cases. Ideal for newcomers to AI."
    }
  ];

  await Course.insertMany(coursesList);
  console.log("Courses inserted successfully!");
}

async function init() {
  const students = await insertUsers();
  await insertCourses(students);
}

module.exports = { init };
