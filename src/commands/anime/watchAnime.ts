import {
  ActionRowBuilder,
  CommandInteraction,
  CommandInteractionOption,
  CommandInteractionOptionResolver,
  GuildMember,
  Options,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { Command } from "../../interfaces/interfcaes";
import { zoroAnimeInfo } from "../../api/zoroTv";

const data = new SlashCommandBuilder()
  .setName("watch")
  .setDescription("Get the Watch link for the Anime")
  .addStringOption((option) =>
    option
      .setName("search")
      .setDescription("Input the Anime Name")
      .setRequired(true)
      .setAutocomplete(true)
  );

const execute: Command["execute"] = async (
  interaction: CommandInteraction
): Promise<void> => {
  const member = interaction.member;

  if (member instanceof GuildMember) {
    const animeName: string = (
      interaction.options as CommandInteractionOptionResolver
    ).getString("search")!;

    interaction.deferReply();
    const animeUrls = (await zoroAnimeInfo(animeName)).url;

    interaction.editReply(`${animeUrls}`);
  }
};

const watchAnimeCommand: Command = {
  data: data as SlashCommandBuilder,
  execute: execute,
};

export default watchAnimeCommand;
