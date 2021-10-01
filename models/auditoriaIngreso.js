const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const auditoriaIngresoSchema = new mongoose.Schema({
  usuario: [{ type: Schema.Types.ObjectId, ref: "usuario" }],
  accion: String,
  fecha_crea: {
    type: Date,
    default: Date.now(),
  },
});

const auditoriaIngreso = mongoose.model(
  "auditoriaIngreso",
  auditoriaIngresoSchema
);

exports.auditoriaIngreso = auditoriaIngreso;
