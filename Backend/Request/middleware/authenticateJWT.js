const jwt = require('jsonwebtoken');
const secretKey = 'secret_key'; // Same secret key used in users_service

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    });
};

module.exports = authenticateJWT;
