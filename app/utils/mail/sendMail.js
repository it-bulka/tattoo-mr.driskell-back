const { Resend } = require("resend");
const logger = require("../logger");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ to, subject, html }) => {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  if (error) {
    logger.error("sendMail", `Failed to send email to ${to}`, {
      errorName: error.name,
      errorMessage: error.message,
      subject,
    });
    throw new Error(`Email sending failed: ${error.message}`);
  }

  logger.info("sendMail", `Email sent successfully to ${to}`, {
    emailId: data?.id,
    subject,
  });
};

module.exports = sendMail;
