const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Usuario } = require("../../models/tarea/usuario");

/**
 * Login de la aplicacion
 */
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  let user = await Usuario.findOne({ user: req.body.user });
  if (!user) {
    res.status(400).send("Usuario y/o contraseña incorrecta");
    return;
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    res.status(400).send("Usuario y/o contraseña incorrecta");
    return;
  }

  const token = user.generateAuthToken();

  res.send(token);
});

router.post("/change-password/:id", async (req, res) => {
  let user = await Usuario.findById(req.params.id);
  if (!user) {
    return res
      .status(400)
      .send("No se encontró el usuario. Favor intente nuevamente");
  }
  const newPassword = req.body.password;
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();
  res.send({
    type: "success",
    message: "Se ha cambiado su contraseña correctamente",
  });
});

function validateUser(req) {
  const schema = Joi.object({
    user: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(req);
}

module.exports = router;
