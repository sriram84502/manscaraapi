const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,              // MUST be smtp.gmail.com
    port: Number(process.env.EMAIL_PORT),      // 587
    secure: false,                              // false for port 587
    auth: {
      user: process.env.EMAIL_USER,            // your Gmail address
      pass: process.env.EMAIL_PASS             // App password
    }
  });

  await transporter.sendMail({
    from: `<${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

module.exports = sendEmail;
