require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT;
const databaseConfig = require("./config/database");
databaseConfig.connectDatabase();


const Task = require("./models/task.model");

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({
            deleted: false
        });
        res.json(tasks);
    } catch (error) {
        res.json("Không tìm thấy");
    }
});

app.get('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne({
            _id: id,
            deleted: false
        });
        res.json(task);
    } catch (error) {
        res.json("Không tìm thấy");
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})