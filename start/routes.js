const error = require("../middleware/error");
const usuario = require("../routes/tarea/usuario");
const tarea = require("../routes/tarea/tarea");
const observacionTarea = require("../routes/tarea/observacionTarea");
const bitacoraEstado = require("../routes/tarea/bitacoraEstado");
const oficina = require("../routes/tarea/oficina");
const auth = require("../routes/auth/auth");

module.exports = function (app) {
  app.use("/bitacora-estado", bitacoraEstado);
  app.use("/observacion-tarea", observacionTarea);
  app.use("/oficina", oficina);
  app.use("/tarea", tarea);
  app.use("/usuario", usuario);
  app.use("/auth", auth);
  app.use(error);
};
