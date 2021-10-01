const mongoose = require("mongoose");
const Joi = require("joi");

const oficinaSchema = new mongoose.Schema({
  nombre: String,
});

const Oficina = mongoose.model("oficina", oficinaSchema);

exports.Oficina = Oficina;
