"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const node_cron_1 = __importDefault(require("node-cron"));
const anilist_1 = require("../api/anilist");
const channelID = process.env.CHANNEL_ID;
exports.default = {
    name: discord_js_1.Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`${client.user?.username} is Online 🦑`);
        node_cron_1.default.schedule("*/3 * * * *", async () => {
            const channel = client.channels.cache.get(channelID);
            if (channel) {
                try {
                    const response = await (0, anilist_1.fetchLatestAnime)();
                    if (!response || response.length === 0) {
                        channel.send("No Anime Airing Today");
                        return; // Exit early since there's nothing to process
                    }
                    const airingTime = response.map((anime) => {
                        return {
                            format: anime.media.format,
                            title: anime.media.title.romaji,
                            episode: anime.episode,
                            url: anime.media.siteUrl,
                            airingAt: new Date(anime.airingAt * 1000).toLocaleString(),
                        };
                    });
                    const embed = new discord_js_1.EmbedBuilder()
                        .setColor(0x9b59b6)
                        .setTitle("Anime Airing Today")
                        .setDescription("Here are the anime airing today:");
                    let animeCount = 0;
                    for (const anime of airingTime) {
                        const date = "2024-09-24"; //new Date().toJSON().slice(0, 10);
                        const animeDate = anime.airingAt.slice(0, 10);
                        const animeTime = anime.airingAt.slice(12, 25);
                        if (anime.format === "TV" && date === animeDate) {
                            animeCount++;
                            embed.addFields({
                                name: `${anime.title} (Episode: ${anime.episode})`,
                                value: `Airing at ${animeTime} | Link: (${anime.url})`,
                            });
                        }
                    }
                    // Send the embed if there's at least one anime airing today
                    if (animeCount > 0) {
                        channel.send({ embeds: [embed] });
                    }
                    else {
                        // Send a message if no anime is airing today
                        channel.send("No TV anime airing today!");
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
        });
    },
};
