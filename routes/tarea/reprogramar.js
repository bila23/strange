const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const moment = require("moment");
const { Justificacion } = require("../../models/tarea/justificacion");
const { Tarea } = require("../../models/tarea/tarea");

router.post("/", auth, async (req, res) => {
  let model = new Justificacion(req.body);
  model = await model.save();
  await updateTarea(req.body.tarea, req.body.nuevaFecha);
  res.send(model);
});

async function updateTarea(tareaId, newDate) {
  const tarea = await Tarea.findById(tareaId);
  let daysDiff = diffDays(tarea.fecha, tarea.fechaFin);
  const newEndDate = moment(newDate).add(daysDiff, "days").toDate();
  const fechaMoment = moment(newDate);

  await Tarea.findByIdAndUpdate(tareaId, {
    fecha: newDate,
    fechaFin: newEndDate,
    diaTarea: fechaMoment.date(),
    mesTarea: 1 + fechaMoment.month(),
    anioTarea: fechaMoment.year(),
  });
}

function diffDays(ini, end) {
  let diff = end.getTime() - ini.getTime();
  let days = diff / (1000 * 3600 * 24);
  return days;
}

module.exports = router;
