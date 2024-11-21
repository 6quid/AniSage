import { EmbedBuilder, Events, TextChannel } from "discord.js";
import fs from "fs";
import { AiringSchedule } from "../interfaces/interfcaes";
import cron from "node-cron";
import { fetchLatestAnime } from "../api/anilist";
import { type BotClient } from "..";
import getRandomWaifu, { Waifu } from "../api/randomWaifu";
import { stripHtmlTags } from "../commands/anime/getInfo";

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
      console.error(
        "No channels found in channels.json. Cron job will not start."
      );
      return;
    }
    // Schedule a job to run every Mid-Night
    cron.schedule(
      "0 0 * * *",
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
                  title: anime.media.title.romaji,
                  episode: anime.episode,
                  url: anime.media.siteUrl,
                  airingAt: new Date(anime.airingAt * 1000).toLocaleString(),
                };
              });

              // Create embed for sending messages
              const embed = new EmbedBuilder()
                .setColor(0x9b59b6)
                .setTitle("Anime Airing Today")
                .setDescription("Here are the anime airing today:")
                .setThumbnail(
                  "https://ashisheditz.com/wp-content/uploads/2024/03/cool-anime-pfp-demon-slayer-HD.jpg"
                )
                .addFields({ name: "\u200b", value: "\u200b" });

              let animeCount = 0;

              // Iterate through airing time data
              for (const anime of airingTime) {
                const date = new Date().toJSON().slice(0, 10);
                const animeDate = anime.airingAt.slice(0, 10);
                const animeTime = anime.airingAt.slice(12, 25);

                // Check if the anime is a TV show and airing today
                if (anime.format === "TV" && date === animeDate) {
                  animeCount++;
                  embed
                    .addFields({
                      name: `${anime.title} (Episode: ${anime.episode})`,
                      value: `Airing at ${animeTime} | Link: (${anime.url})`,
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
              console.log(error);
            }
          }
        }
      },
      { timezone: "America/New_York" }
    );

    // Schedule a job to run every morning at 9 AM
    cron.schedule(
      "0 9 * * *",
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
              console.log(error);
            }
          }
        }
      },
      { timezone: "America/New_York" }
    );
  },
};
