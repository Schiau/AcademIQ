const express = require("express");
const router = express.Router();
const { chat } = require('../services/ChatService');

router
    .route("/")
    .post(async (req, res) => {
        try {
            const {message,} = req.body;
            if (!message) {
                message = 'Hi Gemini';
            }

            const respons = await chat(message)
            res.status(201).json({respons});
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to chat course" });
        }
    });

module.exports = router;