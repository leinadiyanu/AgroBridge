import redisClient from "../../config/redis.js";
import crypto from "crypto";


const OTP_TTL_SECONDS = 10 * 60; // 10 minutes

const generateOtp = (): string =>
  crypto.randomInt(100000, 999999).toString();

const otpKey = (type: "phone" | "email", identifier: string) =>
  `otp:${type}:${identifier}`;

export const saveOtp = async (
  type: "phone" | "email",
  identifier: string,
  otp: string
) => {
  await redisClient.setEx(otpKey(type, identifier), OTP_TTL_SECONDS, otp);
};

export const verifyOtp = async (
  type: "phone" | "email",
  identifier: string,
  otp: string
): Promise<boolean> => {
  const stored = await redisClient.get(otpKey(type, identifier));
  if (!stored || stored !== otp) return false;
  await redisClient.del(otpKey(type, identifier)); // one-time use
  return true;
};

export { generateOtp };