const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    sessions: { type: Number, required: true },
    date_start: { type: Date, required: true },
    date_end: { type: Date, required: true },
    max_slots: { type: Number, required: true },
    current_enroll: [
        {
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            enrollmentDate: { type: Date, required: true }
        }
    ],
    languages: { type: [String], required: true },
    description: { type: String, required: true }
});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;
