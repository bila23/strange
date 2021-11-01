const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { Tarea, validateTarea } = require("../../models/tarea/tarea");
const { BitacoraEstado } = require("../../models/tarea/bitacoraEstado");
const { Usuario } = require("../../models/tarea/usuario");
const TareaService = require("../../services/TareaService");
const moment = require("moment");

router.get("/today/autorizadas/:user", auth, async (req, res) => {
  const actualMoment = moment();
  const list = await Tarea.find({
    estado: "APROBADA",
    responsable: req.params.user,
    anioTarea: actualMoment.year(),
    mesTarea: 1 + actualMoment.month(),
    diaTarea: actualMoment.date(),
  }).sort({
    registro: -1,
  });
  res.send(list);
});

router.get("/autorizadas/:user", auth, async (req, res) => {
  const list = await Tarea.find({
    estado: "APROBADA",
    responsable: req.params.user,
  }).sort({
    registro: -1,
  });
  res.send(list);
});

router.get("/ingresadas", auth, async (req, res) => {
  const list = await Tarea.find({ estado: "INGRESADA" })
    .populate("responsable")
    .populate("oficina")
    .sort({
      fecha: -1,
    });
  res.send(list);
});

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
  const registro = await TareaService.generateCode();
  const todayMoment = moment();
  const fecha = moment(model.fecha);

  model.registro = registro;
  model.mes = 1 + todayMoment.month();
  model.anio = todayMoment.year();
  model.diaTarea = fecha.date();
  model.mesTarea = 1 + fecha.month();
  model.anioTarea = fecha.year();
  model.codigo = registro + " - " + todayMoment.year();

  model = await model.save();

  await TareaService.sendMailToSave();

  res.send(model);
});

router.put("/autorizar/:id/:user", auth, async (req, res) => {
  const usuario = await Usuario.findOne({ user: req.params.user });

  if (!usuario)
    return res
      .status(400)
      .send("No se encontró el usuario que debe autorizar la tarea");

  const fecha = moment(req.body.fecha);
  const conditions = { _id: req.params.id };
  const updateField = {
    descripcion: req.body.descripcion,
    fecha: req.body.fecha,
    responsable: req.body.responsable,
    estado: "APROBADA",
    diaTarea: fecha.date(),
    mesTarea: 1 + fecha.month(),
    anioTarea: fecha.year(),
    autoriza: usuario._id,
  };
  const model = await Tarea.updateOne(conditions, updateField);

  if (!model)
    return res
      .status(400)
      .send("No se encontró el registro que se desea actualizar");

  const bitacoraModel = {
    tarea: model._id,
    estadoAntiguo: "INGRESADA",
    estadoNuevo: "APROBADA",
    usuario_crea: req.params.user,
  };

  const bitacora = new BitacoraEstado(bitacoraModel);
  await bitacora.save();

  const tareaReturn = await Tarea.findById(req.params.id);

  await TareaService.sendMailToOperador(tareaReturn);

  res.send(tareaReturn);
});

router.put("/denegar/:id", auth, async (req, res) => {
  const conditions = { _id: req.params.id };
  const updateField = {
    estado: "DENEGADA",
  };
  const model = await Tarea.updateOne(conditions, updateField);
  if (!model)
    return res
      .status(400)
      .send("No se encontró el registro que se desea actualizar");
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
