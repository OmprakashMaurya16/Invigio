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

const sendDutyAssignedEmail = async (toEmail, professorName, examDetails) => {
  const transporter = createTransporter();

  const { subjectName, subjectCode, examDate, startTime, endTime, venue } =
    examDetails;

  const mailOptions = {
    from: `"Invigio" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Invigio – Exam Duty Assigned",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: #1a1a2e; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Invigio</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #1a1a2e; margin-top: 0;">Exam Duty Assigned</h2>
          <p style="color: #555; line-height: 1.6;">Dear ${professorName},</p>
          <p style="color: #555; line-height: 1.6;">You have been assigned an exam invigilation duty. Please find the details below.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <tr style="background: #f0f4ff;">
              <td style="padding: 10px 14px; font-weight: bold; color: #1a1a2e; width: 40%;">Subject</td>
              <td style="padding: 10px 14px; color: #333;">${subjectName} (${subjectCode})</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; color: #1a1a2e;">Date</td>
              <td style="padding: 10px 14px; color: #333;">${new Date(examDate).toDateString()}</td>
            </tr>
            <tr style="background: #f0f4ff;">
              <td style="padding: 10px 14px; font-weight: bold; color: #1a1a2e;">Time</td>
              <td style="padding: 10px 14px; color: #333;">${startTime} – ${endTime}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; font-weight: bold; color: #1a1a2e;">Venue</td>
              <td style="padding: 10px 14px; color: #333;">${venue}</td>
            </tr>
          </table>
          <p style="color: #888; font-size: 13px; line-height: 1.6;">Please log in to Invigio to accept or respond to this duty assignment.</p>
        </div>
        <div style="background: #f9f9f9; padding: 16px; text-align: center; color: #aaa; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Invigio. All rights reserved.
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendConflictResolvedEmail = async (
  toEmail,
  professorName,
  conflictType,
  resolution,
) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Invigio" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Invigio – Conflict Report Update",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: #1a1a2e; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Invigio</h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #1a1a2e; margin-top: 0;">Conflict Report Updated</h2>
          <p style="color: #555; line-height: 1.6;">Dear ${professorName},</p>
          <p style="color: #555; line-height: 1.6;">
            Your conflict report of type <strong>${conflictType}</strong> has been reviewed by an admin.
          </p>
          <div style="background: #f0f4ff; border-left: 4px solid #4361ee; padding: 16px; border-radius: 4px; margin: 24px 0;">
            <p style="margin: 0; color: #333; line-height: 1.6;"><strong>Resolution:</strong> ${resolution}</p>
          </div>
          <p style="color: #888; font-size: 13px; line-height: 1.6;">Log in to Invigio to view the full details of your conflict report.</p>
        </div>
        <div style="background: #f9f9f9; padding: 16px; text-align: center; color: #aaa; font-size: 12px;">
          &copy; ${new Date().getFullYear()} Invigio. All rights reserved.
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendPasswordResetOTP,
  sendDutyAssignedEmail,
  sendConflictResolvedEmail,
};
