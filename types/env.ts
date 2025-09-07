interface EnvVars {
  PORT: number;
  MONGO_URI: string;
  CLIENT_URL: string;
  JWT_SECRET: string;
  PAYMOB_API_KEY: string;
  PAYMOB_SECRET_KEY: string;
  PAYMOB_API_URL: string;
}

const env: EnvVars = {
  PORT: parseInt(process.env.PORT || "2000"),
  MONGO_URI: process.env.MONGO_URI || "",
  CLIENT_URL: process.env.CLIENT_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  PAYMOB_API_KEY: process.env.PAYMOB_API_KEY || "",
  PAYMOB_SECRET_KEY: process.env.PAYMOB_SECRET_KEY || "",
  PAYMOB_API_URL: process.env.PAYMOB_API_URL || "",
};

if (!env.PORT) throw new Error("PORT is missing in .env");
if (!env.MONGO_URI) throw new Error("MONGO_URI is missing in .env");
if (!env.CLIENT_URL) throw new Error("CLIENT_URL is missing in .env");
if (!env.JWT_SECRET) throw new Error("JWT_SECRET is missing in .env");
if (!env.PAYMOB_API_KEY) throw new Error("PAYMOB_API_KEY is missing in .env");
if (!env.PAYMOB_SECRET_KEY)
  throw new Error("PAYMOB_SECRET_KEY is missing in .env");
if (!env.PAYMOB_API_URL) throw new Error("PAYMOB_API_URL is missing in .env");

export default env;
