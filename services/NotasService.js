const _ = require("lodash");
const { Tarea } = require("../models/tarea/tarea");

//recupero las tareas del dia
//separo las tareas en los diferentes usuarios que hay
//verificar que pasa si no hay usuarios
//en el caso que si haya usuarios recuperar sus tareas
//ver cuantas tareas han finalizado y cuantas tiene pendiente
//calculo de nota

async function separeteInUser() {
  const tareas = await findTodayTareas();
  if (tareas.length === 0) return null;
  const result = _.uniq(tareas, function (model) {
    return model.responsable;
  });
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
