import AfricasTalking from "africastalking";

const at = AfricasTalking({
  apiKey: process.env.AT_API_KEY as string,
  username: process.env.AT_USERNAME as string,
});

const sms = at.SMS;

export const sendSmsOtp = async (phoneNumber: string, otp: string) => {
//   await sms.send({
//     to: [phoneNumber],
//     message: `Your AgroBridge verification code is: ${otp}. It expires in 10 minutes. Do not share it with anyone.`,
//     from: process.env.AT_SENDER_ID, // optional — remove if not configured
//   });
await sms.send({
  to: [phoneNumber],
  message: `Your AgroBridge verification code is: ${otp}. It expires in 10 minutes. Do not share it with anyone.`,
  ...(process.env.AT_SENDER_ID ? { from: process.env.AT_SENDER_ID } : {}),
});
};