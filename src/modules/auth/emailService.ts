import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER as string,
    pass: process.env.GMAIL_APP_PASSWORD as string, // Gmail App Password, not your login password
  },
});

export const sendEmailOtp = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: `"AgroBridge" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your AgroBridge Verification Code",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #2d6a4f;">AgroBridge Verification</h2>
        <p>Use the code below to verify your email address.</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; 
                    color: #1b4332; padding: 16px 0;">
          ${otp}
        </div>
        <p style="color: #666; font-size: 13px;">
          This code expires in <strong>10 minutes</strong>. 
          If you did not request this, please ignore this email.
        </p>
      </div>
    `,
  });
};