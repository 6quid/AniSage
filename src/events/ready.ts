import { Events, TextChannel } from "discord.js";
import { BotClient } from "../index";
import cron from "node-cron";

const channelID = process.env.CHANNEL_ID;
export default {
  name: Events.ClientReady,
  once: true,
  execute(client: BotClient) {
    console.log(`${client.user?.username} is Online 🦑`);

    cron.schedule("0 0 * * *", () => {
      const channel = client.channels.cache.get(channelID!) as TextChannel;

      if (channel) {
      }
    });
  },
};
