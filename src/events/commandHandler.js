const { EmbedBuilder, InteractionType } = require("discord.js");
const { readdirSync } = require("fs");
const functions = require('../functions')

module.exports = async (interaction) => {

    let client = interaction.client;
    if (interaction.type == InteractionType.ApplicationCommand) {
    if (interaction.user.bot) return;
    if (!interaction.guild) return;
 
     readdirSync('./src/commands').forEach(file => {
         const command = require(`../../src/commands/${file}`);
         if(interaction.commandName.toLowerCase() === command.data.name.toLowerCase()) {
         command.run(client, interaction, functions)
     }
     })
 }
}

module.exports.conf = {
    name: "interactionCreate"
}