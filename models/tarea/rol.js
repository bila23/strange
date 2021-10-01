const mongoose = require("mongoose");

const rolSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
});

const Rol = mongoose.model("rol", rolSchema);

exports.Rol = Rol;
