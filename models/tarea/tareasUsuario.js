const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
  tarea: { type: Schema.Types.ObjectId, ref: "tarea" },
  usuario: { type: Schema.Types.ObjectId, ref: "usuario" },
  oficina: { type: Schema.Types.ObjectId, ref: "oficina" },
  date: Date,
  day: Number,
  mes: Number,
  year: Number,
  state: String,
});

const TareasUsuario = mongoose.model("tareasUsuario", schema);

exports.TareasUsuario = TareasUsuario;
