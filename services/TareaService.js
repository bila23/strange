const mongoose = require("mongoose");
const UsuarioService = require("./UsuarioService");
const moment = require("moment");
const { sendMail, sendMailWithCC } = require("../util/mail");
const { Tarea } = require("../models/tarea/tarea");
const { Usuario } = require("../models/tarea/usuario");
const { BitacoraEstado } = require("../models/tarea/bitacoraEstado");

async function saveInDays(model, estado) {
  const ini = moment(model.fecha).toDate();
  const end = moment(model.fechaFin).toDate();

  const diff = Math.abs(end - ini) / 86400000;
  const fecha = model.fecha;
  let newModel = { ...model };

  const id_to_delete = newModel._id;
  await Tarea.findByIdAndDelete(id_to_delete);
  await BitacoraEstado.deleteMany({ tarea: id_to_delete });

  delete newModel._id;

  for (let i = 0; i <= diff; i++) {
    const newFecha = moment(fecha).add(i, "days").toDate();

    if (model.dias.includes(newFecha.getDay())) {
      newModel.fecha = newFecha;
      newModel.fechaFin = newFecha;
      await saveTarea(newModel, estado);
    }
  }
}

async function saveTarea(tarea, estado) {
  let model = new Tarea(tarea);
  const registro = await generateCode();
  const todayMoment = moment();
  const fecha = moment(model.fecha);

  model.registro = registro;
  model.mes = 1 + todayMoment.month();
  model.anio = todayMoment.year();
  model.diaTarea = fecha.date();
  model.mesTarea = 1 + fecha.month();
  model.anioTarea = fecha.year();
  model.estado = estado;
  model.codigo = registro + " - " + todayMoment.year();

  await model.save();

  await saveBitacora(model._id, "", estado, model.usuario_crea);
}

async function findIndicadoresOperador(user) {
  const tareas = await Tarea.aggregate([
    { $sort: { estado: 1 } },
    {
      $group: {
        _id: { estado: "$estado" },
        valor: { $sum: 1 },
      },
    },
    {
      $match: {
        "responsable._idUsuario": { $in: [mongoose.Types.ObjectId(user)] },
      },
    },
  ]).exec();

  return tareas;
}

async function findIndicadoresJefeOficina(oficina) {
  const tareas = await Tarea.aggregate([
    {
      $match: { "responsable.oficinaId": { $in: [oficina] } },
    },
    { $sort: { estado: 1 } },
    {
      $group: {
        _id: { estado: "$estado" },
        valor: { $sum: 1 },
      },
    },
  ]).exec();
  return tareas;
}

async function saveBitacora(tarea, estadoAntiguo, estadoNuevo, user) {
  const bitacoraModel = {
    tarea: tarea,
    estadoAntiguo: estadoAntiguo,
    estadoNuevo: estadoNuevo,
    usuario_crea: user,
  };
  let bitacora = new BitacoraEstado(bitacoraModel);
  await bitacora.save();
}

async function sendMailToSave() {
  try {
    const senders = await UsuarioService.findUserAuthorize();
    const html = `Se ha ingresado una nueva tarea para su revision, favor ingresar al sistema y verificar.<br/><a href="https://jarvis-alpha.vercel.app">[Clic para ir al sistema]</a>`;
    if (!senders || senders.length === 0) return false;

    const length = senders.length;
    const title = "INGRESO DE NUEVA TAREA";

    if (length === 1) await sendMail(senders[0], title, html);
    else await sendMailWithCC(senders[0], title, html, senders);

    return true;
  } catch (e) {
    return false;
  }
}

async function sendMailToOperador(tarea) {
  try {
    const usuario = await Usuario.findById(tarea.responsable[0]);
    if (!usuario) return false;

    const title = "NUEVA TAREA APROBADA";
    const html = `Se ha aprobado una nueva tarea para que la realice, la cual es: <br/><div>
      ${tarea.descripcion}</div><br/>Favor ingrese al sistema para su seguimiento.<br/><a href="https://jarvis-alpha.vercel.app">[Clic para ir al sistema]</a>`;

    await sendMail(usuario.correo, title, html);
    return true;
  } catch (e) {
    return false;
  }
}

async function generateCode() {
  const actualYear = moment().year();
  const tarea = await Tarea.findOne({ anio: actualYear }).sort({
    registro: -1,
  });
  if (!tarea) return 1;

  return tarea.registro + 1;
}

exports.sendMailToSave = sendMailToSave;
exports.generateCode = generateCode;
exports.sendMailToOperador = sendMailToOperador;
exports.saveBitacora = saveBitacora;
exports.findIndicadoresJefeOficina = findIndicadoresJefeOficina;
exports.findIndicadoresOperador = findIndicadoresOperador;
exports.saveInDays = saveInDays;
exports.saveTarea = saveTarea;
