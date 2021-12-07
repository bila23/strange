const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { Tarea, validateTarea } = require("../../models/tarea/tarea");
const { BitacoraEstado } = require("../../models/tarea/bitacoraEstado");
const { Usuario } = require("../../models/tarea/usuario");
const TareaService = require("../../services/TareaService");
const moment = require("moment");
const mongoose = require("mongoose");

router.get("/today/autorizadas/:user", auth, async (req, res) => {
  const actualMoment = moment();
  const list = await Tarea.find({
    estado: { $in: ["APROBADA", "EN PROCESO"] },
    responsable: { $in: [mongoose.Types.ObjectId(req.params.user)] },
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
    estado: { $in: ["APROBADA", "EN PROCESO", "FINALIZADA"] },
    responsable: { $in: [mongoose.Types.ObjectId(req.params.user)] },
  }).sort({
    registro: -1,
    anio: -1,
  });
  res.send(list);
});

router.get("/ingresadas", auth, async (req, res) => {
  const list = await Tarea.find({ estado: "INGRESADA" })
    .populate("responsable")
    .populate("oficina")
    .sort({
      registro: -1,
      anio: -1,
    });
  res.send(list);
});

router.get("/indicadores/:user/:rol/:oficina", auth, async (req, res) => {
  const { user, rol, oficina } = req.params;
  let list = [];

  if (rol === "JEFE OFICINA" || rol === "ADMIN" || rol === "GERENTE")
    list = await TareaService.findIndicadoresJefeOficina(oficina);
  else if (rol === "OPERADOR")
    list = await TareaService.findIndicadoresOperador(user);

  res.send(list);
});

router.get("/oficina/:id", auth, async (req, res) => {
  const list = await Tarea.find({ oficina: req.params.id })
    .populate("responsable")
    .sort({
      registro: -1,
      anio: -1,
    });
  res.send(list);
});

router.get("/responsable/:id", auth, async (req, res) => {
  const list = await Tarea.find({
    responsable: { $in: [mongoose.Types.ObjectId(req.params.id)] },
  }).sort({
    registro: -1,
    anio: -1,
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
  const userResponsable = await Usuario.findById(req.body.responsable);

  model.oficina = userResponsable.oficina[0];
  model.registro = registro;
  model.mes = 1 + todayMoment.month();
  model.anio = todayMoment.year();
  model.diaTarea = fecha.date();
  model.mesTarea = 1 + fecha.month();
  model.anioTarea = fecha.year();
  model.codigo = registro + " - " + todayMoment.year();

  model = await model.save();

  const user = await Usuario.findOne({ user: model.usuario_crea });
  let estado = "";

  if (user.rol[0] === "JEFE OFICINA") {
    estado = "INGRESADA";
    await TareaService.sendMailToSave();
  } else {
    estado = "APROBADA";
    await TareaService.sendMailToOperador(model);
  }

  await TareaService.saveBitacora(model._id, "", estado, req.body.usuario_crea);

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
    tarea: req.params.id,
    estadoAntiguo: "INGRESADA",
    estadoNuevo: "APROBADA",
    usuario_crea: usuario.user,
  };

  const bitacora = new BitacoraEstado(bitacoraModel);
  await bitacora.save();

  const tareaReturn = await Tarea.findById(req.params.id);

  await TareaService.sendMailToOperador(tareaReturn);

  res.send(tareaReturn);
});

router.put("/estado/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { estadoNuevo, estadoAntiguo, user } = req.body;
  const conditions = { _id: id };
  const updateField = {
    estado: estadoNuevo,
  };
  const model = await Tarea.updateOne(conditions, updateField);
  if (!model)
    return res
      .status(400)
      .send("No se encontró el registro que se desea actualizar");

  await TareaService.saveBitacora(id, estadoAntiguo, estadoNuevo, user);

  const tareaReturn = await Tarea.findById(id);

  res.send(tareaReturn);
});

router.put("/denegar/:id/:user", auth, async (req, res) => {
  const { id, user } = req.params;
  const conditions = { _id: id };
  const updateField = {
    estado: "DENEGADA",
  };
  const model = await Tarea.updateOne(conditions, updateField);
  if (!model)
    return res
      .status(400)
      .send("No se encontró el registro que se desea actualizar");

  await TareaService.saveBitacora(id, "INGRESADA", "DENEGADA", user);

  res.send(model);
});

router.put("/:id", auth, async (req, res) => {
  const conditions = { _id: req.params.id };
  const updateField = {
    descripcion: req.body.descripcion,
    fecha: req.body.fecha,
    responsable: { $in: [mongoose.Types.ObjectId(req.body.responsable)] },
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
