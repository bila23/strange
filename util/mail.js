const { transporter, fromObject } = require("./mail-config");

async function sendMail(to, subject, html) {
  const mailData = {
    from: fromObject,
    to: to,
    subject: subject,
    html: html,
  };

  const info = await transporter.sendMail(mailData);
  return info;
}

async function sendMailWithCC(to, subject, html, cc) {
  const mailData = {
    from: fromObject,
    to: to,
    cc: cc,
    subject: subject,
    html: html,
  };

  const info = await transporter.sendMail(mailData);
  return info;
}

exports.sendMail = sendMail;
exports.sendMailWithCC = sendMailWithCC;
