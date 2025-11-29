const taskRouter = require("./task.route");
const userRouter = require("./user.route");
const authMiddleware = require("../middlewares/auth.middleware");

module.exports = (app) => {
    const version1 = '/api/v1';
    app.use(version1 + '/tasks', authMiddleware.requireAuth, taskRouter);
    app.use(version1 + '/users', userRouter);
}