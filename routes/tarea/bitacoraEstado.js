const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { BitacoraEstado } = require("../../models/tarea/bitacoraEstado");

router.get("/:tarea", auth, async (req, res) => {
  const list = await BitacoraEstado.find({ tarea: req.params.tarea }).sort({
    fecha_crea: 1,
  });
  res.send(list);
});

router.get("/:id", auth, async (req, res) => {
  const model = await BitacoraEstado.findById(req.params.id);
  if (!model) return res.status(400).send("No se encontró el registro");
  res.send(model);
});

router.post("/", auth, async (req, res) => {
  let model = new BitacoraEstado(req.body);
  model = await model.save();
  res.send(model);
});

module.exports = router;
