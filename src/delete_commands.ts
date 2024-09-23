import { REST, Routes } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

// instance of REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log(`Started deleting all global application (/) commands.`);

    // Delete all global commands by passing an empty array
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID!),
      { body: [] }
    );

    console.log(`Successfully deleted all global application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
