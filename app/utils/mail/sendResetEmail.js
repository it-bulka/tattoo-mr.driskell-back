const sendMail = require("./sendMail");

const sendResetEmail = async ({ email, token, origin }) => {
  const resetLink = `${origin}/user/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
  const html = `<h1>Please reset your password by clicking on link: <a href="${resetLink}">Reset password</a></h1>`;

  await sendMail({
    to: email,
    subject: "Reset Password Email",
    html,
  });
};

module.exports = { sendResetEmail };
