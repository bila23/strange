const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const Schema = mongoose.Schema;

const usuarioSchema = new mongoose.Schema({
  user: String,
  password: String,
  nombre: String,
  alias: String,
  correo: String,
  activo: Boolean,
  oficina: [{ type: Schema.Types.ObjectId, ref: "oficina" }],
  rol: Array,
  usuario_crea: String,
  fecha_crea: {
    type: Date,
    default: Date.now(),
  },
});

usuarioSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      rol: this.rol,
      user: this.user,
      nombre: this.nombre,
      alias: this.alias,
    },
    config.get("general.jwt")
  );
  return token;
};

const Usuario = mongoose.model("usuario", usuarioSchema);

function validateUser(model) {
  const schema = Joi.object({
    user: Joi.string().required(),
    password: Joi.string().required(),
    nombre: Joi.string().required(),
    alias: Joi.string().required(),
    correo: Joi.string().required(),
    activo: Joi.boolean().required(),
    rol: Joi.array().required(),
    usuario_crea: Joi.string().required(),
  });
  return schema.validate(model);
}

exports.Usuario = Usuario;
exports.validateUser = validateUser;
