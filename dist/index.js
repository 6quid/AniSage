"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotClient = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
//Require the necessary discord.js classes
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Custom Client class extending discord.js Client to include a 'commands' collection
class BotClient extends discord_js_1.Client {
    commands = new discord_js_1.Collection();
}
exports.BotClient = BotClient;
//New Client Instance
const client = new BotClient({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
// Initialize the commands collection
client.commands = new discord_js_1.Collection();
//load files dynamically
const commandsPath = node_path_1.default.join(__dirname, "commands");
const commandFolders = node_fs_1.default.readdirSync(commandsPath);
for (const folder of commandFolders) {
    const folderPath = node_path_1.default.join(commandsPath, folder);
    const commandFiles = node_fs_1.default
        .readdirSync(folderPath)
        .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const filePath = node_path_1.default.join(folderPath, file);
        const command = require(filePath).default; // Ensuring the import is treated as a Command
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        }
        else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}
//loading event files
const eventsPath = node_path_1.default.join(__dirname, "events");
const eventFiles = node_fs_1.default
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
    const filePath = node_path_1.default.join(eventsPath, file);
    const event = require(filePath).default;
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}
client.login(process.env.DISCORD_TOKEN);
