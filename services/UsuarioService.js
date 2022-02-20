const { Usuario } = require("../models/tarea/usuario");

async function findUserAuthorize() {
  const rol = ["ADMIN", "GERENTE"];
  return await Usuario.find({ activo: true, rol: { $in: rol } }).select(
    "correo"
  );
}

async function findById(id) {
  const user = await Usuario.findById(id);
  return user;
}

exports.findUserAuthorize = findUserAuthorize;
exports.findById = findById;
