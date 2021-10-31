const { sendMail, sendMailWithCC } = require("../util/mail");
const UsuarioService = require("./UsuarioService");
const { Tarea } = require("../models/tarea/tarea");
const moment = require("moment");

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
