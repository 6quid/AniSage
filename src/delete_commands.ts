import { Guild, REST, Routes } from "discord.js";
import { CLIENT_ID, DISCORD_TOKEN, GUILD_ID } from "./config";

// instance of REST module
const rest = new REST().setToken(DISCORD_TOKEN!);

(async () => {
  try {
    console.log(`Started deleting all global application (/) commands.`);

    const isTestMode = process.env.BOT_MODE === "test";

    if (isTestMode && GUILD_ID) {
      // Delete all guild commands
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID!, GUILD_ID), {
        body: [],
      });
      console.log(`Successfully deleted all guild application (/) commands.`);

      // Delete all global commands
    } else {
      await rest.put(Routes.applicationCommands(CLIENT_ID!), { body: [] });
      console.log(`Successfully deleted all global application (/) commands.`);
    }
  } catch (error) {
    console.error(error);
  }
})();
