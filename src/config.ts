// src/config.ts
import dotenv from "dotenv";

// Dynamically load the correct .env file based on BOT_MODE
const envFile = process.env.BOT_MODE === "test" ? "./.env.test" : "./.env";
dotenv.config({ path: envFile });

console.log("Loaded Environment Variables from:", envFile);
console.log("BOT_MODE:", process.env.BOT_MODE);

if (!process.env.DISCORD_TOKEN) {
  throw new Error("Missing DISCORD_TOKEN in environment variables");
}
if (!process.env.CLIENT_ID) {
  throw new Error("Missing CLIENT_ID in environment variables");
}

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN!;
export const CLIENT_ID = process.env.CLIENT_ID!;
export const GUILD_ID = process.env.GUILD_ID; // Optional for guild-specific commands
