const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
  tarea: [{ type: Schema.Types.ObjectId, ref: "tarea" }],
  fechaAnterior: Date,

  descripcion: String,
  usuario_crea: String,
  fecha_crea: {
    type: Date,
    default: Date.now(),
  },
});

const Justificacion = mongoose.model("justificacion", schema);

exports.Justificacion = Justificacion;
