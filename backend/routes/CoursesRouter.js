const express = require("express");
const router = express.Router();
const Course = require('../models/Course');  

const { 
    searchCourses, enrollStudent, unenrollStudent, getAvgStudentsAfterYear, getEnrollmentDatesByMonthAndYear, getStudentsAfterDate,  getMyCourses, getPriceForMyCourses
} = require('../services/CoursesService');

router
    .route("/")
    .post(async (req, res) => {
        try {
            const newCourse = new Course(req.body);
            const savedCourse = await newCourse.save();
            res.status(201).json(savedCourse);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to create course" });
        }
    })
    .get(async (req, res) => {
        try {
            let { date_start, date_end, search } = req.query;
            let result = await searchCourses(date_start, date_end, search); 
            res.json({result});
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Something went wrong" });
        }
    });

    router.get("/my-courses", async (req, res) => {
        try {
            const { userId } = req.body;
            const enrolledCourses = await getMyCourses(userId);
            res.json(enrolledCourses);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to retrieve courses" });
        }
    });
    
    router.get("/price", async (req, res) => {
        try {
            const { userId } = req.body;
            const totalPrice = await getPriceForMyCourses(userId);
            res.json({ totalPrice });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to retrieve courses" });
        }
    });

router.post("/:courseId/enroll/:studentId", async (req, res) => {
    try {
        const { courseId, studentId } = req.params;
        const result = await enrollStudent(courseId, studentId)

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to enroll student" });
    }
});

router.delete("/:courseId/unenroll/:studentId", async (req, res) => {
    try {
        const { courseId, studentId } = req.params;
        const result = await unenrollStudent(courseId, studentId)

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to unenroll student" });
    }
});

router.get('/:courseId/avg-students/:year', async (req, res) => {
    const { courseId, year } = req.params;

    try {
        const avgStudents = await getAvgStudentsAfterYear(courseId, parseInt(year));
        res.status(200).json(avgStudents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:courseId/enrollment-dates/:month/:year', async (req, res) => {
    const { courseId, month, year } = req.params;

    try {
        const enrollmentDates = await getEnrollmentDatesByMonthAndYear(courseId, parseInt(month), parseInt(year));
        res.status(200).json(enrollmentDates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:courseId/students-after-date/:day/:month/:year', async (req, res) => {
    const { courseId, day, month, year } = req.params;

    try {
        const students = await getStudentsAfterDate(courseId, day, month, year);
        res.status(200).json({students});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router
    .route("/:id")
    .get(async (req, res) => {
        try {
            const { id } = req.params;    
            const course = await Course.findById(id);
            
            if (!course) {
                return res.status(404).json({ error: "Course not found" });
            }
    
            res.json(course);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch course" });
        }
    })
    .put(async (req, res) => {
        try {
            const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedCourse) return res.status(404).json({ error: "Course not found" });
            res.json(updatedCourse);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to update course" });
        }
    })
    .delete(async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) return res.status(404).json({ error: "Course not found" });
        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete course" });
    }
});

module.exports = router;