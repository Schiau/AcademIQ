require('dotenv').config();
const mongoose = require('mongoose');

const url_db = process.env.URL_DB;
const dbName = process.env.DB_NAME;
console.log(`${url_db}/${dbName}`)


async function connectToDb() {
    try {
        await mongoose.connect(`${url_db}/${dbName}`, {});
        console.log("✅ Connected to MongoDB!");
    } catch (err) {
        console.error("❌ Failed to connect to MongoDB:", err);
        process.exit(1);
    }
}

module.exports = { connectToDb };
