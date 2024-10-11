import path from "path";
import fs from "node:fs";
import { Command } from "./interfaces/interfcaes";
import { APIApplicationCommand, REST, Routes } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const commands: Array<Command> = [];

// Grab all the command folders from the commands directory
const folderPath = path.join(__dirname, "commands");
const commandFolder = fs.readdirSync(folderPath);

for (const folder of commandFolder) {
  // Grab all the command files from the commands directory
  const commandsPath = path.join(folderPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath).default as Command as any;

    // console.log("load cmd", filePath, command);

    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// instance of REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    //FOR DEV PURPOSE ONLY PRIVATE GUILD
    const data: APIApplicationCommand[] = (await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,
        process.env.GUILD_ID!
      ),
      { body: commands }
    )) as APIApplicationCommand[];

    console.log(
      ` ✅ Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
})();
