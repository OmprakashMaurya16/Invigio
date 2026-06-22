const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendPasswordResetOTP = async (toEmail, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Invigio" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Invigio – Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: #1a1a2e; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Invigio</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #1a1a2e; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #555; line-height: 1.6;">
            You requested to reset your password. Use the OTP below to proceed.
            This OTP is valid for <strong>10 minutes</strong>.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <span style="
              display: inline-block;
              background: #f0f4ff;
              border: 2px dashed #4361ee;
              border-radius: 8px;
              padding: 16px 40px;
              font-size: 36px;
              font-weight: bold;
              letter-spacing: 12px;
              color: #4361ee;
            ">${otp}</span>
          </div>
          <p style="color: #888; font-size: 13px; line-height: 1.6;">
            If you did not request this, please ignore this email.
            Your password will remain unchanged.
          </p>
        </div>
        <div style="background: #f9f9f9; padding: 16px; text-align: center; color: #aaa; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Invigio. All rights reserved.
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetOTP };
