"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const anilist_1 = require("../../api/anilist");
const sortChoices = {
    TRENDING_DESC: "Trending",
    POPULARITY_DESC: "Popularity",
    SCORE_DESC: "Score",
    FAVOURITES_DESC: "Favourites",
};
const data = new discord_js_1.SlashCommandBuilder()
    .setName("trending")
    .setDescription("Shows a list of the current trending anime.")
    .addStringOption((option) => option
    .setName("sortby")
    .setDescription("Sort the Trending Anime")
    .addChoices({ name: "Trending", value: "TRENDING_DESC" }, { name: "Popularity", value: "POPULARITY_DESC" }, { name: "Score", value: "SCORE_DESC" }, { name: "Favourites", value: "FAVOURITES_DESC" })
    .setRequired(true));
const execute = async (interaction) => {
    const member = interaction.member;
    if (member instanceof discord_js_1.GuildMember) {
        const sortBy = interaction.options.getString("sortby") || "TRENDING_DESC";
        // Use the API value to get the human-readable name
        const sortByName = sortChoices[sortBy] || "Trending";
        try {
            const animeList = await (0, anilist_1.fetchTrendingAnime)(sortBy);
            // making anime field from animes retirived via animeList.
            const animeDataField = animeList.map((anime) => ({
                name: anime.title.english || anime.title.romaji || "No English Title",
                value: `Link: ${anime.siteUrl} \n`,
                inline: false,
            }));
            const randomIndex = Math.floor(Math.random() * animeList.length);
            const embed = new discord_js_1.EmbedBuilder()
                .setColor(0x9b59b6)
                .setTitle("Trending Anime")
                .setDescription("Current Trending Anime")
                .setThumbnail(animeList[randomIndex].coverImage.medium) // random thumbnail
                .addFields({ name: "Sorted By", value: `${sortByName}` })
                .addFields({ name: "\u200b", value: "\u200b" })
                .addFields(animeDataField)
                .setTimestamp();
            interaction.reply({ embeds: [embed] });
        }
        catch (error) {
            console.log(error);
            interaction.reply("Sorry, I encountered an error while fetching anime.");
        }
    }
};
const trendingCommand = {
    data: data,
    execute: execute,
};
exports.default = trendingCommand;
