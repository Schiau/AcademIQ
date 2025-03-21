const express = require("express");
const router = express.Router();
const User = require('../models/User');
const { saveUser, findByEmaiAndPassword, findByEmail } = require('../services/UserService');
const { generateToken } = require('../services/JWTService');

router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const user = await findByEmail(email);
        if(user){
            res.status(500).json({ error: 'Email already used' });
            return;
        }

        const role = req.body.role || "student";
        const userData = { email, password, name, role: role || "student" };
        await saveUser(userData)

        const savedUser = await findByEmaiAndPassword(email, password);
        const token = generateToken(savedUser._id, savedUser.role);

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await findByEmaiAndPassword(email, password);
        if (!user){
            return res.status(401).json({ error: 'User do not exist' }); 
        }
        const token = generateToken(user._id, user.role);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;