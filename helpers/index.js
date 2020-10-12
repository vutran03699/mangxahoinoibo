const nodeMailer = require("nodemailer");

const defaultEmailData = { from: "noreply@node-react.com" };

exports.sendEmail = emailData => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "masterjupiter2015@gmail.com",
      pass: "kshzlmomlthllktq"
    }
  });
  return transporter
    .sendMail(emailData)
    .then(info => console.log(`Tin nhắn đã gửi: ${info.response}`))
    .catch(err => console.log(`Sự cố gửi email: ${err}`));
};
