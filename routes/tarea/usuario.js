const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const config = require("config");
const { Usuario, validateUser } = require("../../models/tarea/usuario");

router.get("/activos", auth, async (req, res) => {
  const list = await Usuario.find({ activo: true }).sort({
    user: 1,
  });
  res.send(list);
});

router.get("/operador", auth, async (req, res) => {
  const roles = ["OPERADOR"];
  const list = await Usuario.find({ rol: roles }).sort({
    user: 1,
  });
  res.status(200).send(list);
});

router.get("/", auth, async (req, res) => {
  const list = await Usuario.find().populate("oficina").sort({
    user: 1,
  });
  res.status(200).send(list);
});

router.get("/:id", auth, async (req, res) => {
  const model = await Usuario.findById(req.params.id).populate("oficina");
  if (!model) return res.status(400).send("No se encontró el registro");
  res.send(model);
});

router.post("/", auth, async (req, res) => {
  let register = await Usuario.findOne({
    user: req.body.user,
  }).exec();
  if (register)
    return res.status(400).send("Ya existe un usuario con ese nombre");

  register = await Usuario.findOne({
    correo: req.body.correo,
  });
  if (register)
    return res.status(400).send("Ya existe un usuario con ese correo");

  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let model = new Usuario(req.body);
  const salt = await bcrypt.genSalt(10);
  model.password = await bcrypt.hash(model.password, salt);
  model = await model.save();
  const token = model.generateAuthToken();

  res
    .header(config.get("general.token_alias"), token)
    .header(
      config.get("general.header-token"),
      config.get("general.token_alias")
    )
    .send(model);
});

router.put("/:id", auth, async (req, res) => {
  const conditions = { _id: req.params.id };
  const updateField = {
    user: req.body.user,
    nombre: req.body.nombre,
    alias: req.body.alias,
    correo: req.body.correo,
    activo: req.body.activo,
    oficina: req.body.oficina,
    rol: req.body.rol,
    usuario_actualiza: req.body.usuario_actualiza,
    fecha_actualiza: new Date(),
  };
  const model = await Usuario.updateOne(conditions, updateField);
  if (!model)
    return res
      .status(400)
      .send("No se encontró el registro que se desea actualizar");
  res.send(model);
});

module.exports = router;
