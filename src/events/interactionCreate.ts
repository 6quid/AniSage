import { Events, Interaction } from "discord.js";
import { Anime, Command } from "../interfaces/interfcaes";
import { type BotClient } from "..";
import { fetchAnimeTitles } from "../api/anilist";
import { zoroAnimeTitleAutoComplete } from "../api/zoroTv";

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
      const command: Command | undefined = (
        interaction.client as BotClient
      ).commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    } else if (interaction.isAutocomplete()) {
      const command: Command | undefined = (
        interaction.client as BotClient
      ).commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        if (interaction.commandName === "animeinfo") {
          // Getting the user types keywords
          const focusedValue = interaction.options.getFocused();

          //Gets the AnimeTitles String[]
          const choices = await fetchAnimeTitles(focusedValue);

          // Filter the Titles to Lower cases
          const filteredValues = choices.filter((titles) => {
            return titles.toLowerCase().includes(focusedValue.toLowerCase());
          });

          await interaction.respond(
            filteredValues.length
              ? filteredValues.map((title) => ({ name: title, value: title }))
              : []
          );
        } else if (interaction.commandName === "watch") {
          const focusedValue = interaction.options.getFocused();

          if (focusedValue.length < 3) {
            await interaction.respond([]); // Return an empty array if input is too short
            return;
          }

          const titles = await zoroAnimeTitleAutoComplete(focusedValue);

          await interaction.respond(
            titles.map((title: any) => ({ name: title, value: title })) || []
          );
        }
      } catch (error) {
        console.error("Error in AutoComplete: ", error);
        await interaction.respond([]);
      }
    }
  },
};
