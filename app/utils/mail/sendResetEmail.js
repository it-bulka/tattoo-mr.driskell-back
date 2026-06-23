const sendMail = require("./sendMail");

const sendResetEmail = async ({ email, token, origin }) => {
  const resetLink = `${origin}/user/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
        <tr><td style="background-color:#1a1a1a;padding:30px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:24px;">Mr.Driskell</h1>
        </td></tr>
        <tr><td style="padding:40px 30px;">
          <p style="font-size:16px;color:#333333;margin:0 0 20px;">Hello,</p>
          <p style="font-size:16px;color:#333333;margin:0 0 20px;">We received a request to reset the password for your Mr.Driskell account. Click the button below to set a new password:</p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:30px auto;">
            <tr><td style="background-color:#1a1a1a;border-radius:6px;padding:14px 32px;">
              <a href="${resetLink}" target="_blank" style="color:#ffffff;text-decoration:none;font-size:16px;font-weight:bold;display:inline-block;">Reset password</a>
            </td></tr>
          </table>
          <p style="font-size:14px;color:#666666;margin:20px 0 0;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="font-size:13px;color:#999999;word-break:break-all;margin:8px 0 0;">${resetLink}</p>
          <p style="font-size:14px;color:#666666;margin:20px 0 0;">This link will expire in 24 hours.</p>
        </td></tr>
        <tr><td style="background-color:#f9f9f9;padding:20px 30px;text-align:center;">
          <p style="font-size:12px;color:#999999;margin:0;">This email was sent by Mr.Driskell store. If you did not request a password reset, you can safely ignore this email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendMail({
    to: email,
    subject: "Reset your password — Mr.Driskell",
    html,
  });
};

module.exports = { sendResetEmail };
