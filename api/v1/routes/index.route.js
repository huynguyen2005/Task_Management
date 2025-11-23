const taskRouter = require("./task.route");
const userRouter = require("./user.route");

module.exports = (app) => {
    const version1 = '/api/v1';
    app.use(version1 + '/tasks', taskRouter);
    app.use(version1 + '/users', userRouter);
}