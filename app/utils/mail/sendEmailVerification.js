const sendMail = require("./sendMail");

const sendEmailVerification = async ({ email, verificationToken, origin }) => {
  const verifyLink = `${origin}/user/verify-email?token=${encodeURIComponent(verificationToken)}&email=${encodeURIComponent(email)}`;
  const html = `
<h1>Please confirm your email by clicking the link: <a href="${verifyLink}" target="_blank">Confirm email</a></h1>
<p>The link will become inactive after 24 hours.</p>
`;

  await sendMail({
    to: email,
    subject: "Email verification for Mr.Driskell store",
    html,
  });
};

module.exports = { sendEmailVerification };
