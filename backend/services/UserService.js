const User = require('../models/User');
const bcrypt = require('bcrypt');

async function saveUser(userData) {
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = new User({ ...userData, password: hashedPassword });
        await newUser.save();
        return true;
    } catch (error) {
        console.error("Error saving user:", error);
        return false;
    }
}

async function findByEmaiAndPassword(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        return null;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return null;
    }
    return user;
}

async function findByEmail(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        return null;
    }
    return user;
}

module.exports = { saveUser, findByEmaiAndPassword, findByEmail};