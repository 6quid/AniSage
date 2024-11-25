import { Client, TextChannel } from "discord.js";
import { BotClient } from "..";

let botClient: Client;

// Initialize your Discord client (e.g., in your main bot file)
export const initializeBotClient = (client: Client) => {
  botClient = client;
};

// Function to log errors in a specific channel
export const logErrorToChannel = async (error: string, client?: string) => {
  const channelId = process.env.TEST_CHANNEL_ID;
  if (!botClient) {
    console.error("Bot client is not initialized.");
    return;
  }

  const channel = botClient.channels.cache.get(channelId!) as TextChannel;
  if (!channel) {
    console.error("Error log channel not found.");
    return;
  }

  try {
    await channel.send(`🔴 **Error Log**\n\n${error} \n**User: ** ${client}`);
  } catch (err) {
    console.error("Failed to send error log to Discord:", err);
  }
};
