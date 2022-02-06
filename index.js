const app = require("./server");
const tareaCron = require("./jobs/tareaCron");

require("./start/db")();

tareaCron.tareas_proc_aprob_to_pend();
tareaCron.notas();

const PORT = process.env.PORT || 1984;
const server = app.listen(PORT);

module.exports = server;
