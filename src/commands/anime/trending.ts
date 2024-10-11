import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { Anime, Command } from "../../interfaces/interfcaes";
import { fetchTrendingAnime } from "../../api/anilist";

const sortChoices: { [key: string]: string } = {
  TRENDING_DESC: "Trending",
  POPULARITY_DESC: "Popularity",
  SCORE_DESC: "Score",
  FAVOURITES_DESC: "Favourites",
};

const data = new SlashCommandBuilder()
  .setName("trending")
  .setDescription("Shows a list of the current trending anime.")
  .addStringOption((option) =>
    option
      .setName("sortby")
      .setDescription("Sort the Trending Anime")
      .addChoices(
        { name: "Trending", value: "TRENDING_DESC" },
        { name: "Popularity", value: "POPULARITY_DESC" },
        { name: "Score", value: "SCORE_DESC" },
        { name: "Favourites", value: "FAVOURITES_DESC" }
      )
      .setRequired(true)
  );

const execute: Command["execute"] = async (
  interaction: CommandInteraction
): Promise<void> => {
  const member = interaction.member;

  if (member instanceof GuildMember) {
    const sortBy: string =
      (interaction.options as CommandInteractionOptionResolver).getString(
        "sortby"
      ) || "TRENDING_DESC";

    // Use the API value to get the human-readable name
    const sortByName: string = sortChoices[sortBy] || "Trending";

    try {
      const animeList: Anime[] = await fetchTrendingAnime(sortBy);

      // making anime field from animes retirived via animeList.
      const animeDataField = animeList.map((anime: Anime) => ({
        name: anime.title.english || anime.title.romaji,
        value: `Link: ${anime.siteUrl} \n`,
        inline: false,
      }));

      const randomIndex = Math.floor(Math.random() * animeList.length);

      const embed = new EmbedBuilder()
        .setColor(0x9b59b6)
        .setTitle("Trending Anime")
        .setDescription("Current Trending Anime")
        .setThumbnail(animeList[randomIndex].coverImage.medium) // random thumbnail
        .addFields({ name: "Sorted By", value: `${sortByName}` })
        .addFields({ name: "\u200b", value: "\u200b" })
        .addFields(animeDataField)
        .setTimestamp();

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      interaction.reply("Sorry, I encountered an error while fetching anime.");
    }
  }
};

const trendingCommand: Command = {
  data: data as SlashCommandBuilder,
  execute: execute,
};

export default trendingCommand;
