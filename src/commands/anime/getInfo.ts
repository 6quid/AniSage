import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { Command, InfoMedia, StaffMember } from "../../interfaces/interfcaes";
import { fetchAnimeInfo } from "../../api/anilist";

export function stripHtmlTags(html: string) {
  return html.replace(/<\/?[^>]+(>|$)/g, "");
}
// from API to Human Readbale
const animeStatus: { [key: string]: string } = {
  FINISHED: "Finished",
  RELEASING: "Releasing",
  NOT_YET_RELEASED: "Not yet Released",
  CANCELLED: "Cancelled",
};

const animeSource: { [key: string]: string } = {
  ORIGINAL: "Original",
  MANGA: "Manga",
  LIGHT_NOVEL: "Light Novel",
  VISUAL_NOVEL: "Visual Novel",
  VIDEO_GAME: "Video Game",
  OTHER: "Other",
  NOVEL: "Novel",
  DOUJINSHI: "Doujinshi",
  ANIME: "Anime",
  WEB_NOVEL: "Web Novel",
  LIVE_ACTION: "Live Action",
  GAME: "Game",
  COMIC: "Comic",
  MULTIMEDIA_PROJECT: "Multimedia Project",
  PICTURE_BOOK: "Picture Book",
};

const data = new SlashCommandBuilder()
  .setName("animeinfo")
  .setDescription(
    "Get detailed information about any anime, including its description, genres, episodes, and more."
  )
  //option 1 for searching Anime Name asks user to input
  .addStringOption((option) =>
    option
      .setName("search")
      .setDescription("Input the Anime Name")
      .setRequired(true)
      .setAutocomplete(true)
  )

  //option 2 Asks for Format of the Anime; TV, MOVIE, MANGA etc;
  .addStringOption((option) =>
    option
      .setName("format")
      .setDescription("Select the Format for the Anime")
      .addChoices(
        { name: "Anime", value: "TV" },
        { name: "Manga", value: "MANGA" }
      )
      .setRequired(true)
  );

const execute: Command["execute"] = async (
  interaction: CommandInteraction
): Promise<void> => {
  const member = interaction.member;

  if (member instanceof GuildMember) {
    // storing the user input in animeName
    const animeName: string = (
      interaction.options as CommandInteractionOptionResolver
    ).getString("search")!;

    //storing the user Format selection in animeFormat and having "TV" as default
    const animeFormat: string =
      (interaction.options as CommandInteractionOptionResolver).getString(
        "format"
      ) || "TV";

    try {
      const animeDetails: InfoMedia | null = await fetchAnimeInfo(
        animeName,
        animeFormat
      );

      if (!animeDetails) {
        throw new Error("No anime Details found");
      }

      const anime: InfoMedia = animeDetails;

      let animeCreator;

      if (anime.staff && anime.staff.edges) {
        animeCreator = anime.staff.edges.find(
          (staff: StaffMember) =>
            staff.role === "Original Creator" ||
            staff.role === "Director" ||
            "Not Available"
        );
      }

      const clearDescription: string = stripHtmlTags(anime.description);
      const genreList: string = anime.genres.join(", ");

      // making the status human-readable by providing key
      const readableStatus: string = animeStatus[anime.status];

      // giving Key to Sources
      const readableSource: string = animeSource[anime.source];

      // getting latest anime episode
      let latestEpisode: number;

      if (anime.status === "RELEASING") {
        latestEpisode = anime.nextAiringEpisode?.episode! - 1;
      } else if (anime.status === "FINISHED" || anime.status === "CANCELLED") {
        latestEpisode = anime.episodes!;
      } else {
        latestEpisode = anime.nextAiringEpisode?.episode!;
      }

      if (anime.format === "TV") {
        const embed = new EmbedBuilder()
          .setColor(0x9b59b6)
          .setTitle(anime.title.romaji)
          .setDescription(clearDescription)
          .setThumbnail(anime.coverImage.large)
          .addFields(
            {
              name: "genres",
              value: genreList,
            },
            {
              name: "\u200B",
              value: "\u200B",
            },
            {
              name: "Premiered",
              value: `${anime.startDate.year} - ${anime.startDate.month} - ${anime.startDate.day}`,
              inline: true,
            },
            {
              name: "Source",
              value: readableSource,
              inline: true,
            },
            {
              name: "Episodes",
              value: `${latestEpisode}`,
              inline: true,
            }
          )
          .addFields(
            {
              name: "Average Score",
              value: `${anime.averageScore}`,
            },
            {
              name: "Status",
              value: `${readableStatus}`,
            },
            {
              name: "Link",
              value: `${anime.siteUrl}`,
            }
          )
          .setImage(anime.bannerImage)
          .setTimestamp()
          .setFooter({
            text: `Directed By: ${animeCreator?.node.name.full}`,
          });

        interaction.reply({ embeds: [embed] });
      } else if (anime.format === "MANGA") {
        let latestChapter: string | number;
        if (anime.status === "RELEASING") {
          latestChapter = "Ongoing";
        } else {
          latestChapter = anime.chapters!;
        }
        const embed = new EmbedBuilder()
          .setColor(0x9b59b6)
          .setTitle(anime.title.romaji)
          .setDescription(clearDescription)
          .setThumbnail(anime.coverImage.large)
          .addFields(
            {
              name: "genres",
              value: genreList,
            },
            {
              name: "\u200B",
              value: "\u200B",
            },
            {
              name: "Premiered",
              value: `${anime.startDate.year} - ${anime.startDate.month} - ${anime.startDate.day}`,
              inline: true,
            },
            {
              name: "Source",
              value: readableSource,
              inline: true,
            },
            {
              name: "Chapters",
              value: `${latestChapter}`,
              inline: true,
            }
          )
          .addFields(
            {
              name: "Average Score",
              value: `${anime.averageScore}`,
            },
            {
              name: "Status",
              value: `${readableStatus}`,
            },
            {
              name: "Link",
              value: `${anime.siteUrl}`,
            }
          )
          .setImage(anime.bannerImage)
          .setTimestamp()
          .setFooter({
            text: `Directed By: ${animeCreator?.node.name.full}`,
          });

        interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      // Send an informative message to the member
      await interaction.reply({
        content:
          "Sorry, I couldn't find any anime details for that search. Please try again!",
        ephemeral: true,
      });
      console.error("Error fetching anime details:", error);
    }
  }
};

const InfoCommand: Command = {
  data: data as SlashCommandBuilder,
  execute: execute,
};

export default InfoCommand;
