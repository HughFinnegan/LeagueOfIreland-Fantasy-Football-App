const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');

    console.log('Token received in middleware:', token); // Debug log

    if (!token) {
        console.log('No token, authorization denied');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Use process.env.JWT_SECRET
        req.user = decoded.user;
        console.log('Decoded user in middleware:', req.user); // Debug log
        next();
    } catch (err) {
        console.error('Token is not valid:', err.message); // Debug log
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
