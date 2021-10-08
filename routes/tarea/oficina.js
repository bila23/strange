const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { Oficina } = require("../../models/tarea/oficina");

router.get("/", auth, async (req, res) => {
  const list = await Oficina.find().sort({
    nombre: 1,
  });
  res.send(list);
});

router.get("/:id", auth, async (req, res) => {
  const model = await Oficina.findById(req.params.id);
  if (!model) return res.status(400).send("No se encontró el registro");
  res.send(model);
});

module.exports = router;
