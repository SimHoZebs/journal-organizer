const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, content) => {
  try {
    const msg = {
      to,
      from: "noreply@em919.journal-organizer.com",
      subject,
      html: content,
    };
    await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
