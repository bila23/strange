const UsuarioService = require("./UsuarioService");
const { sendMail, sendMailWithCC } = require("../util/mail");

async function sendToAuthorize() {
  try {
    const senders = await UsuarioService.findUserAuthorize();
    if (!senders || senders.length === 0) return false;
    const html = `Se ha ingresado una reprogramación para su revision, favor ingresar al sistema y verificar.<br/><a href="https://jarvis-alpha.vercel.app">[Clic para ir al sistema]</a>`;
    const length = senders.length;
    const title = "INGRESO DE REPROGRAMACIÓN DE TAREA";
    if (length === 1) await sendMail(senders[0], title, html);
    else await sendMailWithCC(senders[0], title, html, senders);
    return true;
  } catch (e) {
    return false;
  }
}

async function sendToResp(tarea) {
  try {
    const html = `Se ha autorizado la reprogramación de su tarea, favor ingresar al sistema y verificar.<br/><a href="https://jarvis-alpha.vercel.app">[Clic para ir al sistema]</a>`;
    const title = "AUTORIZACIÓN DE REPROGRAMACIÓN DE TAREA";
    for (const model of tarea.responsable) {
      const user = await UsuarioService.findById(model._id);
      await sendMail(user.correo, title, html);
    }
    return true;
  } catch (e) {
    return false;
  }
}

exports.sendToAuthorize = sendToAuthorize;
exports.sendToResp = sendToResp;
