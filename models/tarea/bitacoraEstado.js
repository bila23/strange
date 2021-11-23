const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bitacoraEstadoSchema = new mongoose.Schema({
  tarea: [{ type: Schema.Types.ObjectId, ref: "tarea" }],
  estadoAntiguo: String,
  estadoNuevo: String,
  usuario_crea: String,
  fecha_crea: {
    type: Date,
    default: Date.now,
  },
});

const BitacoraEstado = mongoose.model("bitacoraEstado", bitacoraEstadoSchema);

exports.BitacoraEstado = BitacoraEstado;
