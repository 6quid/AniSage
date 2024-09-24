"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// instance of REST module
const rest = new discord_js_1.REST().setToken(process.env.DISCORD_TOKEN);
(async () => {
    try {
        console.log(`Started deleting all global application (/) commands.`);
        // Delete all global commands by passing an empty array
        const data = await rest.put(discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID), { body: [] });
        console.log(`Successfully deleted all global application (/) commands.`);
    }
    catch (error) {
        console.error(error);
    }
})();
