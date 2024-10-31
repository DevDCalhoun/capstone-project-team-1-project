module.exports = function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.session.userId) {
            return res.status(401).send('Unauthorized: Please log in');
        }

        const userRole = req.session.userRole;  // Assuming the role is stored in session
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).send('Forbidden: You do not have permission to access this resource');
        }

        next();
    };
};

