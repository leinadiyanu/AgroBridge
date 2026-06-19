//Add general sendSMS alongside sendSmsOtp
import AfricasTalking from "africastalking";
const at = AfricasTalking({
    apiKey: process.env.africa_talking_key,
    username: process.env.africa_talking_username,
});
const sms = at.SMS;
export const sendSmsOtp = async (phoneNumber, otp) => {
    try {
        const result = await sms.send({
            to: [phoneNumber],
            message: `Your AgroBridge OTP is: ${otp}. It expires in 5 minutes. Do not share it with anyone.`,
            ...(process.env.africa_talking_sender_id
                ? { from: process.env.africa_talking_sender_id }
                : {}),
        });
    }
    catch (error) {
        console.error("Error sending SMS:", error);
    }
};
export const sendSMS = async (to, message) => {
    try {
        const result = await sms.send({
            to: [to],
            message,
            ...(process.env.africa_talking_sender_id
                ? { from: process.env.africa_talking_sender_id }
                : {}),
        });
        return result;
    }
    catch (error) {
        console.error("Error sending SMS:", error);
    }
};
//# sourceMappingURL=smsService.js.map