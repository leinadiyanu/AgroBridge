import { Role } from "@prisma/client";

export const registerFlow = {
  start: "name",

  steps: {
    name: {
      prompt: "CON Enter your full name",
      validate: (input: string) => /^[a-zA-Z\s]{2,}$/.test(input),
      error: "CON Invalid name. Enter letters only",
      next: "location",
    },

    location: {
      prompt: "CON Enter your location",
      validate: (input: string) => input.length >= 2,
      error: "CON Enter a valid location",
      next: "role",
    },

    role: {
      prompt: `CON Select role
1. Farmer
2. Buyer
3. Agent`,
      validate: (input: string) => ["1", "2", "3"].includes(input),
      error: `CON Invalid role
1. Farmer
2. Buyer
3. Agent`,
      next: "pin",
      transform: (input: string) => {
        const map: any = {
          "1": Role.FARMER,
          "2": Role.BUYER,
          "3": Role.AGENT,
        };
        return map[input];
      },
    },

    pin: {
      prompt: "CON Create a 4-digit PIN",
      validate: (input: string) => /^\d{4}$/.test(input),
      error: "CON PIN must be 4 digits",
      next: "confirmPin",
    },

    confirmPin: {
      prompt: "CON Confirm your PIN",
      validate: (input: string) => /^\d{4}$/.test(input),
      error: "CON Invalid PIN",
      action: "CREATE_USER",
    },
  },
};