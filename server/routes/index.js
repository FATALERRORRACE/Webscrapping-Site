const express = require("express");
const app = express();

app.use(require("./userRoutes.js"));
app.use(require("./login.js"));
app.use(require("./webscrapping.js"));
module.exports = app;

