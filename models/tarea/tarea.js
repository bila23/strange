const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const tareaSchema = new mongoose.Schema({
  descripcion: String,
  fecha: Date,
  responsable: [{ type: Schema.Types.ObjectId, ref: "usuario" }],
  autoriza: [{ type: Schema.Types.ObjectId, ref: "usuario" }],
  estado: String,
  usuario_crea: String,
  fecha_crea: {
    type: Date,
    default: Date.now(),
  },
});

const Tarea = mongoose.model("tarea", tareaSchema);

function validateTarea(model) {
  const schema = Joi.object({
    descripcion: Joi.string().required(),
    fecha: Joi.date().required(),
    responsable: Joi.string().required(),
    autoriza: Joi.any().optional(),
    estado: Joi.string().required(),
    usuario_crea: Joi.string().required(),
  });
}

exports.Tarea = Tarea;
exports.validateTarea = validateTarea;
