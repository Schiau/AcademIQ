const express = require("express");
const router = express.Router();

const { searchCourses } = require('../services/CoursesService');

router
    .route("/")
    .get(async (req, res) => {
        try {
            let { date_start, date_end, search } = req.query;
            let result = await searchCourses(date_start, date_end, search);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Something went wrong" });
        }
    });

module.exports = router;