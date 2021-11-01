const { sendMail, sendMailWithCC } = require("../util/mail");
const { Tarea } = require("../models/tarea/tarea");
const { Usuario } = require("../models/tarea/usuario");
const { BitacoraEstado } = require("../models/tarea/bitacoraEstado");
const UsuarioService = require("./UsuarioService");
const moment = require("moment");

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
