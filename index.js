require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT;
const databaseConfig = require("./config/database");
databaseConfig.connectDatabase();

const routesApiVer1 = require('./api/v1/routes/index.route');
const bodyParser = require('body-parser');

// parse application/json
app.use(bodyParser.json());

routesApiVer1(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})