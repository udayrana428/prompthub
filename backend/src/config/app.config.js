export const appConfig = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 8000,
  apiVersion: process.env.API_VERSION || "v1",
  appUrl: process.env.APP_URL || "http://localhost:3000",

  jwt: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    accessExpiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    refreshExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  },

  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
  },

  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  },
};
