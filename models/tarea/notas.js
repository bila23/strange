const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notasSchema = new mongoose.Schema({
  usuario: { type: Schema.Types.ObjectId, ref: "usuario" },
  fecha: Date,
  day: Number,
  month: Number,
  year: Number,
  resultado: Number,
  finalizadas: Number,
  pendientes: Number,
});

const Notas = mongoose.model("notas", notasSchema);

exports.Notas = Notas;
