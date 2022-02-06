const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { Notas } = require("../../models/tarea/notas");

router.get("/:day/:month/:year", auth, async (req, res) => {
  const { day, month, year } = req.params;
  const notas = await Notas.find({
    day: day,
    month: month,
    year: year,
  })
    .populate("usuario")
    .sort({ usuario: 1 });
  res.send(notas);
});

module.exports = router;
