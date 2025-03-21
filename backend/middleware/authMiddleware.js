const jwt = require("jsonwebtoken");

const secret_key = process.env.JWT_KEY;

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, secret_key, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Forbidden: Invalid token" });
        }
        req.body.userId = decoded.userId;
        req.body.role = decoded.role;
        next();
    });
}

module.exports = verifyToken;
