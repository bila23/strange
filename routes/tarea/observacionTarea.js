const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const {
  ObservacionesTarea,
  validateObs,
} = require("../../models/tarea/observacionesTarea");

router.get("/tarea/:tarea", auth, async (req, res) => {
  const list = await ObservacionesTarea.find({ tarea: req.params.tarea }).sort({
    fecha_crea: 1,
  });
  res.send(list);
});

router.get("/bitacora/:bitacora/tarea/:tarea", auth, async (req, res) => {
  const list = await ObservacionesTarea.find({
    tarea: req.params.tarea,
    bitacoraEstado: req.params.bitacora,
  });
  res.send(list);
});

router.get("/:id", auth, async (req, res) => {
  const model = await ObservacionesTarea.findById(req.params.id);
  if (!model) return res.status(400).send("No se encontró el registro");
  res.send(model);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateObs(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let model = new ObservacionesTarea(req.body);
  model = await model.save();
  res.send(model);
});

module.exports = router;
