const _ = require("lodash");
const { TareasUsuario } = require("../models/tarea/tareasUsuario");
const { Tarea } = require("../models/tarea/tarea");
const { Notas } = require("../models/tarea/notas");

async function execute() {
  await separeteInUser();
  const tareas = await tareasByUser();
  const users = await distinctUser();
  await calculateSaveNotas(users, tareas);
}

async function calculateSaveNotas(users, tareas) {
  if (users.length === 0 || tareas.length === 0) return null;

  const now = new Date();

  for (const user of users) {
    const list = _.filter(tareas, function (model) {
      return String(model.usuario) === String(user);
    });
    const result = _.groupBy(list, "state");
    await saveNotas(user, result, now);
  }
}

async function saveNotas(user, tareas, date) {
  if (tareas.length === 0) return null;

  await Notas.deleteOne({
    usuario: user,
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  });

  let keys = Object.keys(tareas);
  let finalizadas = 0;
  let nof = 0;
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === "FINALIZADA") finalizadas = tareas[keys[i]].length;
    else if (keys[i] === "DENEGADA" || keys[i] === "INGRESADA");
    else nof = nof + tareas[keys[i]].length;
  }

  const resultado = (finalizadas / (finalizadas + nof)) * 10;
  let nota = new Notas({
    usuario: user,
    fecha: date,
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    resultado: resultado,
    finalizadas: finalizadas,
    pendientes: nof,
  });
  await nota.save();
}

async function distinctUser() {
  const now = new Date();
  const result = await TareasUsuario.find({
    day: now.getDate(),
    mes: now.getMonth() + 1,
    year: now.getFullYear(),
  }).distinct("usuario");
  return result;
}

async function tareasByUser() {
  const now = new Date();
  const list = await TareasUsuario.find({
    day: now.getDate(),
    mes: now.getMonth() + 1,
    year: now.getFullYear(),
  });
  return list;
}

async function separeteInUser() {
  const tareas = await findTodayTareas();
  if (tareas.length === 0) return null;
  let tu;
  for (const model of tareas) {
    for (const responsable of model.responsable) {
      tu = new TareasUsuario({
        tarea: model._id,
        usuario: responsable._idUsuario,
        oficina: responsable.oficinaId,
        date: model.fechaFin,
        day: new Date(model.fechaFin).getDate(),
        mes: new Date(model.fechaFin).getMonth() + 1,
        year: new Date(model.fechaFin).getFullYear(),
        state: model.estado,
      });
      await tu.save();
    }
  }
}

async function findTodayTareas() {
  const now = new Date();

  const result = await Tarea.aggregate()
    .addFields({
      year: { $year: "$fechaFin" },
      month: { $month: "$fechaFin" },
      day: { $dayOfMonth: "$fechaFin" },
    })
    .match({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    });

  return result;
}

exports.findTodayTareas = findTodayTareas;
exports.separeteInUser = separeteInUser;
exports.tareasByUser = tareasByUser;
exports.distinctUser = distinctUser;
exports.calculateSaveNotas = calculateSaveNotas;
exports.execute = execute;
