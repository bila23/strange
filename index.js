const app = require("./server");

require("./start/db")();

const PORT = process.env.PORT || 1984;
const server = app.listen(PORT);

module.exports = server;
