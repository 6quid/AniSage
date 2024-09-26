import fs from "node:fs";
import path from "node:path";

//Require the necessary discord.js classes
import {
  Client,
  Collection,
  CommandInteraction,
  GatewayIntentBits,
} from "discord.js";
import dotenv from "dotenv";

dotenv.config();

// Interface defining the structure of a Command object
export interface Command {
  data: {
    name: string;
    description: string;
  };
  execute: (interaction: CommandInteraction) => Promise<void>;
}

//Interfcaes for Anime Data

export interface Anime {
  id: number;
  title: {
    english?: string;
    romaji: string;
  };
  siteUrl: string;
  coverImage: {
    medium: string;
  };
}

export interface Media {
  format: string;
  title: {
    english?: string;
    romaji: string;
  };
  siteUrl: string;
  coverImage: {
    medium: string;
  };
}
export interface InfoMedia {
  description: string;
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  genres: string[];
  source: string;
  chapters?: number; // For manga, if applicable
  volumes?: number; // For manga, if applicable
  episodes?: number; // For anime, if applicable
  averageScore?: number; // Out of 100
  status: string; // e.g., "RELEASING", "FINISHED"
  nextAiringEpisode?: {
    id: number;
    airingAt: number;
    episode: number;
  };
  coverImage: {
    large: string;
    medium: string;
  };
}

export interface AiringSchedule {
  id: number;
  anime: Anime;
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
  media: Media;
}
//media query response structure
export interface AnimeResponse {
  data: {
    Page: {
      media: Anime[];
    };
  };
}

// Response interface for Anime/Manga or any format Info
export interface MediaInfoResponse {
  data: {
    Media: InfoMedia[];
  };
}

//AiringSchedule query response structure
export interface AiringScheduleResponse {
  data: {
    Page: {
      airingSchedules: AiringSchedule[];
    };
  };
}
// Custom Client class extending discord.js Client to include a 'commands' collection
export class BotClient extends Client {
  commands: Collection<string, Command> = new Collection();
}
//New Client Instance
const client = new BotClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Initialize the commands collection
client.commands = new Collection();

//load files dynamically
const commandsPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command = require(filePath).default as Command; // Ensuring the import is treated as a Command

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

//loading event files

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath).default;

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.DISCORD_TOKEN);
