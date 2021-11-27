const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const tareaSchema = new mongoose.Schema({
  descripcion: String,
  fecha: Date,
  fechaFin: Date,
  oficina: [{ type: Schema.Types.ObjectId, ref: "oficina" }],
  responsable: [{ type: Schema.Types.ObjectId, ref: "usuario" }],
  autoriza: [{ type: Schema.Types.ObjectId, ref: "usuario" }],
  estado: String,
  mes: Number,
  anio: Number,
  diaTarea: Number,
  mesTarea: Number,
  anioTarea: Number,
  codigo: String,
  horaInicio: Date,
  horaFin: Date,
  registro: Number,
  usuario_crea: String,
  fecha_crea: {
    type: Date,
    default: Date.now(),
  },
});

const Tarea = mongoose.model("tarea", tareaSchema);

function validateTarea(model) {
  const schema = Joi.object({
    oficina: Joi.any().optional(),
    descripcion: Joi.string().required(),
    fecha: Joi.date().required(),
    fechaFin: Joi.date().required(),
    responsable: Joi.string().required(),
    autoriza: Joi.any().optional(),
    estado: Joi.string().required(),
    mes: Joi.any().optional(),
    horaInicio: Joi.any().optional(),
    horaFin: Joi.any().optional(),
    diaTarea: Joi.any().optional(),
    mesTarea: Joi.any().optional(),
    anioTarea: Joi.any().optional(),
    anio: Joi.any().optional(),
    codigo: Joi.any().optional(),
    registro: Joi.any().optional(),
    usuario_crea: Joi.string().required(),
  });
  return schema.validate(model);
}

exports.Tarea = Tarea;
exports.validateTarea = validateTarea;
