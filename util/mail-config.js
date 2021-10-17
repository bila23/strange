const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: false,
});

const fromObject = {
  name: "Jarvis",
  address: "wgbila@gmail.com",
};

exports.transporter = transporter;
exports.fromObject = fromObject;
