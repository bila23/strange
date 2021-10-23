const { Usuario } = require("../models/tarea/usuario");

async function findUserAuthorize() {
  const rol = ["ADMIN", "GERENTE"];
  return await Usuario.find({ activo: true, rol: { $in: rol } }).select(
    "correo"
  );
}

exports.findUserAuthorize = findUserAuthorize;
