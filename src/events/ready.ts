import { EmbedBuilder, Events, TextChannel } from "discord.js";
import fs from "fs";
import { AiringSchedule } from "../interfaces/interfcaes";
import cron from "node-cron";
import { fetchLatestAnime } from "../api/anilist";
import { type BotClient } from "..";
import getRandomWaifu, { Waifu } from "../api/randomWaifu";
import { stripHtmlTags } from "../commands/anime/getInfo";
import { log } from "console";
import { logErrorToChannel } from "../utils/logErrors";

let channelIDs: string[] = [];

async function fetchChannelIDs() {
  try {
    const data = await fs.promises.readFile("channels.json", "utf8");

    channelIDs = JSON.parse(data).channelIds;
  } catch (error) {
    console.error("Error reading channels.json:", error);
  }
}

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: BotClient) {
    console.log(`${client.user?.username} is Online 🦑`);

    await fetchChannelIDs();

    if (channelIDs.length === 0) {
      logErrorToChannel(
        `❌
        No channel IDs found in channels.json \nCron Job will not Start`,
        client.user?.username
      );
      return;
    }
    // Schedule a job to run every 12 hours at 12:30 AM and 12:30 PM
    cron.schedule(
      "30 */12 * * *",
      async () => {
        for (const channelID of channelIDs) {
          const channel = client.channels.cache.get(channelID!) as TextChannel;

          if (channel) {
            try {
              const response = await fetchLatestAnime();

              // Check if there are any airing anime
              if (!response || response.length === 0) {
                channel.send("No Anime Airing Today");
                return; // Exit early since there's nothing to process
              }

              // Map response to a more manageable structure
              const airingTime = response.map((anime: AiringSchedule) => {
                return {
                  format: anime.media.format,
                  title: anime.media.title.english ?? anime.media.title.romaji,
                  episode: anime.episode,
                  url: anime.media.siteUrl,
                  airingAt: anime.airingAt,
                  bannerImage: anime.media.bannerImage,
                };
              });

              // Extract non-null banner images
              const validBannerImages = airingTime
                .map((anime) => anime.bannerImage)
                .filter((image) => image !== null);

              // Pick a random banner image or use a fallback
              const randomBannerImage =
                validBannerImages[
                  Math.floor(Math.random() * validBannerImages.length)
                ] ||
                "https://preview.redd.it/made-this-anime-banner-in-pixlr-v0-eni9yujjzvxa1.jpg?width=640&crop=smart&auto=webp&s=c50ebd777da4882f6ac9d293a7a61b4ac4e88f23";

              // Create embed for sending messages
              const embed = new EmbedBuilder()
                .setColor(0x9b59b6)
                .setTitle("Anime Airing Today")
                .setDescription("Here are the anime airing today:")
                .setImage(randomBannerImage)
                .setThumbnail(
                  "https://ashisheditz.com/wp-content/uploads/2024/03/cool-anime-pfp-demon-slayer-HD.jpg"
                )
                .addFields({ name: "\u200b", value: "\u200b" });

              let animeCount = 0;

              // Iterate through airing time data
              for (const anime of airingTime) {
                const currentDateUTC = new Date().toISOString().slice(0, 10);

                const animeAiringDate = new Date(anime.airingAt * 1000);

                const localTime = animeAiringDate.toLocaleTimeString("en-US", {
                  timeZone: "America/New_York",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });

                const animeDateUTC = animeAiringDate.toISOString().slice(0, 10);

                // Check if the anime is airing today
                if (animeDateUTC === currentDateUTC) {
                  animeCount++;
                  embed
                    .addFields({
                      name: `▸ ${anime.title} (Episode: ${anime.episode})`,
                      value: `Airing at ${localTime} • ${animeDateUTC} \nLink: (${anime.url})  \nFormat: ${anime.format}`,
                    })
                    .setTimestamp();
                }
              }

              // Send the embed if there's at least one anime airing today
              if (animeCount > 0) {
                channel.send({
                  content: "@here",
                  embeds: [embed],
                });
              } else {
                // Send a message if no anime is airing today
                channel.send("No TV anime airing today!");
              }
            } catch (error) {
              logErrorToChannel(
                `Error in Cron Job for Anime's Airing ${error as any}`,
                client.user?.username
              );
            }
          }
        }
      },
      { timezone: "America/New_York" }
    );

    // Schedule a job to run every morning at 10 AM
    cron.schedule(
      "0 10 * * *",
      async () => {
        for (const channelID of channelIDs) {
          const channel = client.channels.cache.get(channelID!) as TextChannel;

          if (channel) {
            try {
              const waifu: Waifu | undefined = await getRandomWaifu();

              if (!waifu) {
                channel.send(
                  "No waifu available today. Please try again later."
                );
                return;
              }

              const description = waifu!.description
                ? waifu!.description.slice(0, 1024) + "..."
                : "No description available.";

              const clearDescription = stripHtmlTags(description);
              const embed = new EmbedBuilder()
                .setColor(0x9b59b6)
                .setTitle(`Waifu of the Day is: \n\n${waifu!.name.full}`)
                .setDescription(clearDescription)
                .setImage(waifu!.image.large)
                .setURL(waifu!.siteUrl)
                .setFooter({
                  text: `Source:  ${
                    waifu!.media.nodes[0].title.romaji
                  } \nType:  ${waifu!.media.nodes[0].type}\n`,
                });

              channel.send({
                content: "@here",
                embeds: [embed],
              });
            } catch (error) {
              logErrorToChannel(
                `Error in Cron Job for Waifu of Day ${error as any}`,
                client.user?.username
              );
            }
          }
        }
      },
      { timezone: "America/New_York" }
    );
  },
};
