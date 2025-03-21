const jwt = require('jsonwebtoken');
const secret_key = process.env.JWT_KEY;

function generateToken(id, role) {   
    const token = jwt.sign(
        { userId: id, role: role }, 
        secret_key, {
        expiresIn: '1h',
    });
    return token;
}

module.exports = { generateToken };
