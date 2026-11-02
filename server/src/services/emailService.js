import nodemailer from 'nodemailer';
import { config, isSmtpConfigured } from '../config/env.js';
import { renderOtpEmail } from '../templates/emailTemplates.js';

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!isSmtpConfigured()) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass
    }
  });

  return transporter;
};

export const sendEmailOtp = async ({ to, name, otp, purpose }) => {
  if (!isSmtpConfigured()) {
    const errorMsg = 'SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS in server/.env with Gmail App Password.';
    console.warn(`[SecureAuth Mailer] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  const mailer = getTransporter();
  const html = renderOtpEmail({ name, otp, purpose, expirationMinutes: 5 });

  const subject =
    purpose === 'REGISTRATION'
      ? 'SecureAuth Verification Code - Complete Registration'
      : 'SecureAuth Security Code - Reset Password';

  const mailOptions = {
    from: config.smtp.from,
    to,
    subject,
    html,
    text: `Your SecureAuth verification code is: ${otp}. It expires in 5 minutes. Do not share this code.`
  };

  const info = await mailer.sendMail(mailOptions);
  return { success: true, messageId: info.messageId };
};
