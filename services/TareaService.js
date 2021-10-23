const { sendMail } = require("../util/mail");

async function sendMailToSave() {
  try {
    const html = `Se ha ingresado una nueva tarea para su revision, favor ingresar al sistema y verificar.<br/><a href="https://jarvis-alpha.vercel.app">[Clic para ir al sistema]</a>`;
    await sendMail("wgbila@gmail.com", "INGRESO DE NUEVA TAREA", html);
    return true;
  } catch (e) {
    return false;
  }
}

exports.sendMailToSave = sendMailToSave;
