declare const generateOtp: () => string;
export declare const saveOtp: (type: "phone" | "email", identifier: string, otp: string) => Promise<void>;
export declare const verifyOtp: (type: "phone" | "email", identifier: string, otp: string) => Promise<boolean>;
export { generateOtp };
//# sourceMappingURL=otpService.d.ts.map