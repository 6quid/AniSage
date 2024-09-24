"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const data = new discord_js_1.SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong! and user Info");
const execute = async (interaction) => {
    const member = interaction.member;
    // Ensure member is a GuildMember and not APIInteractionGuildMember
    if (member instanceof discord_js_1.GuildMember) {
        const joinDate = new Date(member.joinedTimestamp);
        const formattedJoinDate = joinDate.toDateString(); // Example: "Mon Sep 04 2023"
        await interaction.reply(`Pong! Pong!\n@${interaction.user.username}, you joined on ${formattedJoinDate}`);
    }
    else {
        await interaction.reply("Couldn't retrieve your join date.");
    }
};
const pingCommand = {
    data: data,
    execute: execute,
};
exports.default = pingCommand;
