const express = require("express");
const router = express.Router();
const { Rol } = require("../../models/tarea/rol");

router.get("/", auth, async (req, res) => {
  const list = await Rol.find().sort({
    nombre: 1,
  });
  res.status(200).send(list);
});

module.exports = router;
