const { TareasUsuario } = require("../models/tarea/tareasUsuario");
const { Tarea } = require("../models/tarea/tarea");

//recupero las tareas del dia
//ingreso las tareas para los diferentes usuarios que hay en un dia
//verificar que pasa si no hay usuarios
//ver cuantas tareas han finalizado y cuantas tiene pendiente
//calculo de nota
//guardar la nota por dia

async function tareasByUser() {
  const now = new Date();
  const list = await TareasUsuario.aggregate()
    .addFields({
      year: { $year: "$date" },
      month: { $month: "$date" },
      day: { $dayOfMonth: "$date" },
    })
    .match({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
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
