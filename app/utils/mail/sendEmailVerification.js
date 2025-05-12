const sendMail = require('./sendMail')

const sendEmailVerification = async ({ email, verificationToken, origin }) => {
  const verifyLink = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`
  const message = `
<h1>Please confirm your email clickin on link: <a href="${verifyLink}" target="_blank">Confirm email</a></h1>
<p>The link will become inactive after 24 hours.</p>
`

  await sendMail({
    to: email,
    subject: 'Email varification for TattooMachines store',
    text: message,
    html: message
  })
}

module.exports = { sendEmailVerification }