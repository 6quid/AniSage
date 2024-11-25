import { AutocompleteInteraction, Events, Interaction } from "discord.js";
import { Anime, Command } from "../interfaces/interfcaes";
import { type BotClient } from "..";
import { fetchAnimeTitles } from "../api/anilist";
import { zoroAnimeTitleAutoComplete } from "../api/zoroTv";
import { logErrorToChannel } from "../utils/logErrors";

const debounceTimers: { [key: string]: NodeJS.Timeout | null } = {};

const debounce = (cb: Function, wait: number) => {
  return (...args: any) => {
    const key = args[0].id;
    if (debounceTimers[key]) clearTimeout(debounceTimers[key]!);

    debounceTimers[key] = setTimeout(() => {
      cb(...args);
      debounceTimers[key] = null;
    }, wait);
  };
};
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
        const client = interaction.user.username;
        logErrorToChannel(error as any, client);
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
          const focusedValue = interaction.options.getFocused();

          // Fetch titles only if the input is meaningful
          if (focusedValue.length < 2) {
            await interaction.respond([]); // Return empty array for short input
            return;
          }
          const handleAnimeInfoAutoComplete = debounce(
            async (interaction: AutocompleteInteraction) => {
              const choices = await fetchAnimeTitles(focusedValue);

              // Filter and respond with results
              const filteredValues = choices.filter((title) =>
                title.toLowerCase().includes(focusedValue.toLowerCase())
              );

              const limitedChoices = filteredValues.slice(0, 25);
              await interaction.respond(
                limitedChoices.map((title) => ({
                  name: title,
                  value: title,
                })) || []
              );
            },
            300
          ); // Debounce for 300ms

          // Call the debounced handler
          handleAnimeInfoAutoComplete(interaction);
        }

        // Debounced handler for "watch" command
        if (interaction.commandName === "watch") {
          const focusedValue = interaction.options.getFocused();

          // Short input, return empty response
          if (focusedValue.length < 3) {
            await interaction.respond([]);
            return;
          }

          const handleWatchAutoComplete = debounce(
            async (interaction: AutocompleteInteraction) => {
              const titles = await zoroAnimeTitleAutoComplete(focusedValue);

              const limitedChoices = titles.slice(0, 25);
              await interaction.respond(
                limitedChoices.map((title: any) => ({
                  name: title,
                  value: title,
                })) || []
              );
            },
            300
          ); // Debounce for 300ms

          // Call the debounced handler
          handleWatchAutoComplete(interaction);
        }
      } catch (error) {
        const client = interaction.user.username;
        logErrorToChannel(
          `❌ Error In AutoComplete 
          \n${error}` as any,
          client
        );
        await interaction.respond([]);
      }
    }
  },
};
