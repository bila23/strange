const express = require("express");
const app = express();

require("./start/logging")();
require("./start/config")(app);
require("./start/routes")(app);

module.exports = app;
