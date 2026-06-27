export const authSteps = {
  loginPin: {
    prompt: "CON Enter your PIN",
    validate: (input: string) => /^\d{4}$/.test(input),
    error: "CON PIN must be 4 digits",
    action: "VERIFY_LOGIN_PIN",
  },
};