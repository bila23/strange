const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const responsableSchema = {
  _idUsuario: String,
  nombre: String,
  oficina: String,
  oficinaId: String,
};

const tareaSchema = new mongoose.Schema({
  descripcion: String,
  fecha: Date,
  fechaFin: Date,
  responsable: [responsableSchema],
  autoriza: [{ type: Schema.Types.ObjectId, ref: "usuario" }],
  estado: String,
  mes: Number,
  anio: Number,
  diaTarea: Number,
  mesTarea: Number,
  anioTarea: Number,
  codigo: String,
  dias: Array,
  horaInicio: Date,
  lider: { type: Schema.Types.ObjectId, ref: "usuario" },
  horaFin: Date,
  registro: Number,
  grupal: String,
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
    responsable: Joi.array().required(),
    autoriza: Joi.any().optional(),
    estado: Joi.string().required(),
    mes: Joi.any().optional(),
    horaInicio: Joi.any().optional(),
    horaFin: Joi.any().optional(),
    diaTarea: Joi.any().optional(),
    mesTarea: Joi.any().optional(),
    anioTarea: Joi.any().optional(),
    grupal: Joi.any().optional(),
    anio: Joi.any().optional(),
    lider: Joi.any().optional(),
    codigo: Joi.any().optional(),
    dias: Joi.any().optional(),
    registro: Joi.any().optional(),
    usuario_crea: Joi.string().required(),
  });
  return schema.validate(model);
}

exports.Tarea = Tarea;
exports.validateTarea = validateTarea;
