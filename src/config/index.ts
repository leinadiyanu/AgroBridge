import dotenv from "dotenv"

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  key: process.env.africa_talking_key || "",
  username: process.env.africa_talking_username || "",
};

