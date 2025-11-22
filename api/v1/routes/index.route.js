const taskRouter = require("./task.route");

module.exports = (app) => {
    const version1 = '/api/v1';
    app.use(version1 + '/tasks', taskRouter);
}