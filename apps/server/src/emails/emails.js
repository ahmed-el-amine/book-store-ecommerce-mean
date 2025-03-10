import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_SERVER,
  port: Number(process.env.EMAIL_SMTP_PORT || 587), // Use 465 for SSL, 587 for TLS
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PASS,
  },
});

const defaultEmail = {
  to: '',
  subject: '',
  text: '',
  html: '',
};

export const sendMail = async (props = defaultEmail) => {
  try {
    await transporter.sendMail({
      from: `${process.env.WEBSITE_NAME} <${process.env.EMAIL_SMTP_USER}>`,
      to: props.to,
      subject: props.subject,
      text: props.text,
      html: props.html,
    });
    return true;
  } catch (error) {
    return false;
  }
};
