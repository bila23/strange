const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jarvis.system.func@gmail.com",
    pass: "2021Jarvis2021",
  },
});

const fromObject = {
  name: "Jarvis",
  address: "jarvis.system.func@gmail.com",
};

exports.transporter = transporter;
exports.fromObject = fromObject;
