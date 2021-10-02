const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const observacionesTareaSchema = new mongoose.Schema({
  tarea: [{ type: Schema.Types.ObjectId, ref: "tarea" }],
  bitacoraEstado: [{ type: Schema.Types.ObjectId, ref: "bitacoraEstado" }],
  descripcion: String,
  usuario_crea: String,
  fecha_crea: {
    type: Date,
    default: Date.now(),
  },
});

const ObservacionesTarea = mongoose.model(
  "observacionesTarea",
  observacionesTareaSchema
);

function validateObs(model) {
  const schema = Joi.object({
    tarea: Joi.string().required(),
    bitacoraEstado: Joi.string().required(),
    descripcion: Joi.string().required(),
    usuario_crea: Joi.string().required(),
  });
  return schema.validate(model);
}

exports.ObservacionesTarea = ObservacionesTarea;
exports.validateObs = validateObs;
