import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import { AuthRepository } from "./repository.js";
import { AppError } from "../../shared/middleware/index.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../shared/utils/tokenHandler.js";
import { generateOtp, saveOtp, verifyOtp } from "./otpService.js";
import { sendSmsOtp } from "../services/smsService.js";
import { sendEmailOtp } from "../services/emailService.js";
import { NotificationService } from "../notifications/service.js";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const notificationService = new NotificationService();

interface RegisterInitiateInput {
  phoneNumber: string;
  email: string;
  name: string;
  location: string;
  role: Role;
  password: string;
}

interface RegisterVerifyInput {
  phoneNumber: string;
  email: string;
  phoneOtp: string;
  emailOtp: string;
  // We re-read the pending data from Redis so nothing sensitive sits in the request
}

interface LoginInitiateInput {
  phoneNumber: string;
  password: string;
}

interface LoginVerifyInput {
  phoneNumber: string;
  otp: string;
}

export class AuthService {
  private repo = new AuthRepository();

  // ── Register Step 1: validate + send OTPs ────────────────────────────────

  async registerInitiate(input: RegisterInitiateInput) {
    const { phoneNumber, email, name, location, role, password } = input; //phoneNumber, name, location, ROLE, passwordHash

    if (password.length < 8) {
      //Must be greater than 8, Basic password length check. More complex rules can be added as needed.
      throw new AppError("Password must be at least 8 characters", 400);
    }

    const existingByPhone = await this.repo.findByPhone(phoneNumber);
    if (existingByPhone) {
      throw new AppError(
        "An account with this phone number already exists. Please log in.",
        409,
      );
    }

    if (email) {
      const existingByEmail = await this.repo.findByEmail(email);
      if (existingByEmail) {
        throw new AppError("Email is already in use", 409);
      }
    }

    // Hash password and stash pending registration in Redis
    const passwordHash = await bcrypt.hash(password, 12);
    await this.repo.savePendingRegistration(phoneNumber, {
      phoneNumber,
      email,
      name,
      location,
      role,
      passwordHash,
    });

    // Generate and send OTPs
    const phoneOtp = generateOtp();
    const emailOtp = generateOtp();

    const otpTasks = [
      saveOtp("phone", phoneNumber, phoneOtp),
      sendSmsOtp(phoneNumber, phoneOtp),
    ];

    // Only add email tasks if email was provided
    if (email) {
      otpTasks.push(
        saveOtp("email", email, emailOtp),
        sendEmailOtp(email, emailOtp),
      );
    }

    await Promise.all(otpTasks);
    return {
      message: email
        ? "OTPs sent to your phone number and email. They expire in 5 minutes."
        : "OTP sent to your phone number. It expires in 5 minutes.",
      channels: email ? ["phone", "email"] : ["phone"],
    };
  }

  // ── Register Step 2: verify OTPs + create account ────────────────────────

  async registerVerify(input: RegisterVerifyInput) {
    const { phoneNumber, email, phoneOtp, emailOtp } = input;

    // Always verify phone
    const phoneValid = await verifyOtp("phone", phoneNumber, phoneOtp);
    if (!phoneValid) {
      throw new AppError("Phone OTP is invalid or expired", 400);
    }

    // Only verify email if it was provided
    if (email) {
      const emailValid = await verifyOtp("email", email, emailOtp);
      if (!emailValid) {
        throw new AppError("Email OTP is invalid or expired", 400);
      }
    }

    // Retrieve pending registration data from Redis
    const pending = await this.repo.getPendingRegistration(phoneNumber);
    if (!pending) {
      throw new AppError(
        "Registration session expired. Please start again.",
        400,
      );
    }

    // Generate tokens BEFORE creating user — so if this crashes, no broken user in DB
    const user = await this.repo.createUser(pending);

    let accessToken: string;
    let refreshToken: string;

    try {
      accessToken = generateAccessToken(user.id, user.role);
      refreshToken = generateRefreshToken(user.id);
    } catch (err) {
      // Token generation failed — roll back user creation
      await this.repo.deleteUser(user.id);
      throw new AppError("Account creation failed. Please try again.", 500);
    }

    await this.repo.createRefreshToken(
      user.id,
      refreshToken,
      new Date(Date.now() + SEVEN_DAYS_MS),
    );

    await this.repo.clearPendingRegistration(phoneNumber);

    // After registerVerify creates user
    await notificationService.notify({ type: "welcome", userId: user.id });

    return { user, accessToken, refreshToken };
  }

  // ── Login Step 1: verify password + send OTP ─────────────────────────────

  async loginInitiate(input: LoginInitiateInput) {
    const { phoneNumber, password } = input;

    const user = await this.repo.findByPhone(phoneNumber);

    const dummyHash =
      "$2a$12$invalidhashfortimingprotection000000000000000000000";
    const hash = user?.passwordHash ?? dummyHash;
    const isMatch = await bcrypt.compare(password, hash);

    if (!user || !isMatch) {
      throw new AppError("Invalid phone number or password", 401);
    }

    if (!user.passwordHash) {
      throw new AppError(
        "No web password set. Please register on the web to activate web login.",
        403,
      );
    }

    const otp = generateOtp();
    await saveOtp("phone", phoneNumber, otp);
    await sendSmsOtp(phoneNumber, otp);

    return {
      message: "OTP sent to your phone number. It expires in 5 minutes.",
    };
  }

  // ── Login Step 2: verify OTP + issue tokens ───────────────────────────────

  async loginVerify(input: LoginVerifyInput) {
    const { phoneNumber, otp } = input;

    const isValid = await verifyOtp("phone", phoneNumber, otp);
    if (!isValid) {
      throw new AppError("OTP is invalid or expired", 401);
    }

    const user = await this.repo.findByPhone(phoneNumber);
    if (!user) throw new AppError("User not found", 404);

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    await this.repo.createRefreshToken(
      user.id,
      refreshToken,
      new Date(Date.now() + SEVEN_DAYS_MS),
    );

    const { passwordHash, pin, ...safeUser } = user;

    return { user: safeUser, accessToken, refreshToken };
  }

  // ── Refresh ───────────────────────────────────────────────────────────────

  async refresh(token: string) {
    let payload: { userId: string };
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw new AppError("Invalid or expired refresh token", 401);
    }

    const stored = await this.repo.findRefreshToken(token);
    if (!stored || stored.expiresAt < new Date()) {
      throw new AppError(
        "Refresh token not recognised. Please log in again.",
        401,
      );
    }

    const user = await this.repo.findById(payload.userId);
    if (!user) throw new AppError("User no longer exists", 401);

    const newAccessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    await this.repo.rotateRefreshToken(
      token,
      user.id,
      newRefreshToken,
      new Date(Date.now() + SEVEN_DAYS_MS),
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // ── Logout ────────────────────────────────────────────────────────────────

  async logout(token: string) {
    await this.repo.deleteRefreshToken(token);
  }

  // ── Me ────────────────────────────────────────────────────────────────────

  async getMe(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    return user;
  }
}
