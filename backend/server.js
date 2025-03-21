require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT;

const { init } = require('./config/initialData');
const { connectToDb } = require('./config/db');

async function startServer() {
    await connectToDb();
    await init(); 
}
startServer();

app.use(cors());
    app.use(express.json());

    app.use("/auth", require("./routes/AuthRouter"));
    app.use("/courses", require("./routes/CoursesUnprotectedRoute"));

    app.use(require('./middleware/authMiddleware'));

    app.use("/courses", require("./routes/CoursesRouter"));
    app.use("/chat", require("./routes/ChatRouter"));

    app.use("/role", (req, res) => {
        const role = req.body.role;
        const userId = req.body.userId;
        return res.json({userId, role});
    })

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });