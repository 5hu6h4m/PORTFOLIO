const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token = req.cookies?.adminToken || 
                (req.headers.authorization && req.headers.authorization.startsWith('Bearer') 
                    ? req.headers.authorization.split(' ')[1] 
                    : null);

    if (token && token !== 'null' && token !== 'undefined') {
        try {
            const secret = process.env.JWT_SECRET || 's2world-secret-v2';
            const decoded = jwt.verify(token, secret);
            req.adminId = decoded.id;
            next();
        } catch (error) {
            console.error('Auth check error:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
