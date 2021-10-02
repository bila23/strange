const error = require("../middleware/error");
const usuario = require("../routes/tarea/usuario");
const auth = require("../routes/auth/auth");

module.exports = function (app) {
  app.use("/usuario", usuario);
  app.use("/auth", auth);
  app.use(error);
};
