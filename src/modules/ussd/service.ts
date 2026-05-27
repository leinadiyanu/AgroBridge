import { UssdRepository } from "./repository.js";
import { AuthService } from "../auth/service.js";

type UssdRequest = {
  sessionId: string;
  phoneNumber: string;
  text: string;
};

type UssdStep =
  | "MAIN_MENU"
  | "SIGNUP_NAME"
  | "SIGNUP_LOCATION"
  | "SIGNUP_COUNTRY"
  | "SIGNUP_OTP"
  | "LOGIN_OTP"
  | "MARKET";

type Session = {
  sessionId: string;
  phoneNumber: string;
  step: UssdStep;
  data: Record<string, string>;
};

const sessions = new Map<string, Session>();

export class UssdService {
  private repo = new UssdRepository();
  private auth = new AuthService();

 async processRequest({ sessionId, phoneNumber, text }: UssdRequest) {
  let session = sessions.get(sessionId);

  // FIRST TIME USER → SHOW MAIN MENU
  if (!session || text === "") {
    session = {
      sessionId,
      phoneNumber,
      step: "MAIN_MENU",
      data: {}
    };

    sessions.set(sessionId, session);

    return `CON Welcome to AgroBridge
1. Register
2. Login
3. Market Prices
4. Exit`;
  }

  const userInput = text.split("*");
  const lastInput = userInput[userInput.length - 1] || "";

  switch (session.step) {

    case "MAIN_MENU":
      return this.handleMainMenu(lastInput, session);

    case "SIGNUP_NAME":
      return this.handleSignupName(lastInput, session);

    case "SIGNUP_LOCATION":
      return this.handleSignupLocation(lastInput, session);

    case "SIGNUP_COUNTRY":
      return this.handleSignupCountry(lastInput, session);

    case "SIGNUP_OTP":
      return this.handleSignupOtp(lastInput, session, phoneNumber);

    default:
      return `END Invalid session`;
  }
}

private handleMainMenu(input: string, session: Session) {
  switch (input) {
    case "1":
      session.step = "SIGNUP_NAME";
      return `CON Enter your full name`;

    case "2":
      session.step = "SIGNUP_OTP";
      return `CON Enter OTP sent to your phone`;

    case "3":
      return `END Market feature coming soon`;

    case "4":
      return `END Goodbye!`;

    default:
      return `CON Invalid option
1. Register
2. Login
3. Market Prices
4. Exit`;
  }
}
  /**
   * SIGN IN FLOW
   */
  private handleSignupName(input: string, session: Session) {
  session.data.name = input;
  session.step = "SIGNUP_LOCATION";

  return `CON Enter your location (City, State)`;
}

/**
   * LOCATION FLOW
   */
private handleSignupLocation(input: string, session: Session) {
  session.data.location = input;
  session.step = "SIGNUP_COUNTRY";

  return `CON Enter your country`;
}

/**
   * COUNTRY FLOW
   */
private handleSignupCountry(input: string, session: Session) {
  session.data.country = input;
  session.step = "SIGNUP_OTP";

  // TODO: send OTP here
  // await this.auth.sendOtp(session.phoneNumber);

  return `CON We sent an OTP to your phone. Enter OTP`;
}

/**
   * OTP FLOW
   */
private async handleSignupOtp(
  input: string,
  session: Session,
  phoneNumber: string
) {
  const otp = input;

  // TODO: verify OTP
  // const valid = await this.auth.verifyOtp(phoneNumber, otp);

  const valid = true; // temporary

  if (!valid) {
    return `END Invalid OTP`;
  }

  // TODO: save user to DB
  // await this.repo.createUser(...)

  sessions.delete(session.sessionId);

  return `END Account created successfully`;
}
}