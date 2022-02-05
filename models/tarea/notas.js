const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const notasSchema = new mongoose.Schema({
  usuario: { type: Schema.Types.ObjectId, ref: "usuario" },
  fecha: Date,
  total: Number,
  finalizadas: Number,
  pendientes: Number,
});

const Notas = mongoose.model("notas", notasSchema);

exports.Notas = Notas;
