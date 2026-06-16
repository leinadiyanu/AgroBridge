import redisClient from "../../config/redis.js";
import crypto from "crypto";


const OTP_TTL_SECONDS = 5 * 60; // 5 minutes

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
  const key = otpKey(type, identifier);
  const stored = await redisClient.get(key);
  
  console.log('OTP DEBUG:', { key, stored, provided: otp });
  
  if (!stored || stored !== otp) return false;
  await redisClient.del(key);
  return true;
};

export { generateOtp };