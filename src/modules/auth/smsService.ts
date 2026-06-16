import AfricasTalking from "africastalking";

const at = AfricasTalking({
  apiKey: process.env.africa_talking_key as string,
  username: process.env.africa_talking_username as string,
});

const sms = at.SMS;

export const sendSmsOtp = async (phoneNumber: string, otp: string) => {
  try {
    const result = await sms.send({
      to: [phoneNumber],
      message: `Your AgroBridge verification code is: ${otp}. It expires in 10 minutes. Do not share it with anyone.`,
      ...(process.env.africa_talking_sender_id
        ? { from: process.env.africa_talking_sender_id }
        : {}),
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};
