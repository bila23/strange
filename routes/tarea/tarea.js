const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { Tarea, validateTarea } = require("../../models/tarea/tarea");
const TareaService = require("../../services/TareaService");

router.get("/oficina/:id", auth, async (req, res) => {
  const list = await Tarea.find({ oficina: req.params.id }).sort({
    fecha: 1,
  });
  res.send(list);
});

router.get("/responsable/:id", auth, async (req, res) => {
  const list = await Tarea.find({ responsable: req.params.id }).sort({
    fecha: 1,
  });
  res.send(list);
});

router.get("/:id", auth, async (req, res) => {
  const model = await Tarea.findById(req.params.id);
  if (!model) return res.status(400).send("No se encontró el registro");
  res.send(model);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateTarea(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let model = new Tarea(req.body);
  model = await model.save();

  await TareaService.sendMailToSave();

  res.send(model);
});

router.put("/:id", auth, async (req, res) => {
  const conditions = { _id: req.params.id };
  const updateField = {
    descripcion: req.body.descripcion,
    fecha: req.body.fecha,
    responsable: req.body.responsable,
    estado: req.body.estado,
  };
  const model = await Tarea.updateOne(conditions, updateField);
  if (!model)
    return res
      .status(400)
      .send("No se encontró el registro que se desea actualizar");
  res.send(model);
});

module.exports = router;
