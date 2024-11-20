import { type BotClient } from "..";
import { Guild, TextChannel } from "discord.js";

export default {
  name: "guildCreate",
  once: false,
  async execute(client: BotClient, guild: Guild) {
    console.log(`Joined a new guild: ${guild.name}`);

    // find first Default Channel with SendMessages permission
    const defaultChannel = guild.channels.cache.find(
      (channel) =>
        channel.isTextBased() &&
        channel.permissionsFor(guild.members.me!)?.has("SendMessages")
    ) as TextChannel;

    if (defaultChannel) {
      const message = await defaultChannel.send(
        `Hello! Thank you for inviting me to **${guild.name}**. \n\nMy name is **${client.user?.username}** 🦑\n\nPlease set a channel for daily updates and notifications using the \`/setchannel\` command.`
      );
    }
  },
};
