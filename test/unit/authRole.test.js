const authorizeRole = require('../../middleware/authRole');

describe('authRole Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { session: { userId: 'testUserId' } };
        res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        next = jest.fn();
    });

    it('should call next if user has the authorized role', () => {
        req.session.userRole = 'tutor'; // Set userRole to authorized role

        const middleware = authorizeRole('tutor', 'admin');
        middleware(req, res, next);

        expect(next).toHaveBeenCalled(); // next() is called, meaning access is granted
    });

    it('should return 403 if user role is not authorized', () => {
        req.session.userRole = 'student'; // Set userRole to unauthorized role

        const middleware = authorizeRole('tutor', 'admin');
        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalledWith('Forbidden: You do not have permission to access this resource');
        expect(next).not.toHaveBeenCalled(); // next() is not called, meaning access is denied
    });

    it('should return 401 if user is not authenticated', () => {
        req.session.userId = null; // User is not logged in

        const middleware = authorizeRole('tutor', 'admin');
        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Unauthorized: Please log in');
        expect(next).not.toHaveBeenCalled();
    });
});