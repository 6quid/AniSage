import { GuildMember, SlashCommandBuilder } from "discord.js";
import { Command } from "../../index";

const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong! and user Info");

const execute: Command["execute"] = async (interaction) => {
  const member = interaction.member;

  // Ensure member is a GuildMember and not APIInteractionGuildMember
  if (member instanceof GuildMember) {
    const joinDate = new Date(member.joinedTimestamp!);
    const formattedJoinDate = joinDate.toDateString(); // Example: "Mon Sep 04 2023"

    await interaction.reply(
      `Pong! Pong!\n<@${interaction.user.id}>, you joined on ${formattedJoinDate}`
    );
  } else {
    await interaction.reply("Couldn't retrieve your join date.");
  }
};

const pingCommand: Command = {
  data: data,
  execute: execute,
};

export default pingCommand;
