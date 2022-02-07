const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recoverPasswordSchema = new mongoose.Schema({
  usuario: { type: Schema.Types.ObjectId, ref: "usuario" },
  fecha_crea: {
    type: Date,
    default: Date.now(),
  },
});

const RecoverPassword = mongoose.model(
  "recoverPassword",
  recoverPasswordSchema
);

exports.RecoverPassword = RecoverPassword;
