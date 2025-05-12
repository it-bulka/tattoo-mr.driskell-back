const nodeMailerConfig = require(`./nodeMailerConfig`)
const nodeMailer = require("nodemailer");

const sendMail = async ({ to, subject, html, text }) => {
  const transporter = nodeMailer.createTransport(nodeMailerConfig)
  await transporter.sendMail({
    from: 'i.it.bulka@gmail.com',
    to,
    subject,
    html,
    text
  })
}

module.exports = sendMail