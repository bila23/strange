const { sendMail } = require("../util/mail");

async function sendMailToSave() {
  try {
    await sendMail("wgbila@gmail.com", "PRUEBA", "PRUEBA");
    return true;
  } catch (e) {
    return false;
  }
}

exports.sendMailToSave = sendMailToSave;
