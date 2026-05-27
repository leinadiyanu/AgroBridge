export class AuthService {
  // constructor(private repo: any) {}

  async register(data: any) {
    // TODO: implement
    return {};
  }

  async authenticate(credentials: any) {
    // TODO: implement
    return null;
  }

  // async sendOtp(phone: string) {
  //   const otp = Math.floor(100000 + Math.random() * 900000);

  //   // store OTP (Redis recommended)
  //   await storeOtp(phone, otp);

  //   // send via SMS (Africa's Talking)
  //   await sendSms(phone, `Your AgroBridge OTP is ${otp}`);
  // }

  // async verifyOtp(phone: string, otp: string) {
  //   const stored = await getStoredOtp(phone);
  //   return stored === otp;
  // }
}
