const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType, ChannelType, PermissionFlagsBits, ThreadChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed } = require("discord.js");
const { SlashCommandBuilder, channelLink } = require("@discordjs/builders");
const config = require("../config.json")
const guildSettings = require('../database/guildSettings')

module.exports = {
  // Owo 
  data: new SlashCommandBuilder()
    .setName("invite_bot")
    .setDescription("Botu sunucunuza davet edersiniz."),

    run: async (client, interaction, functions) => {

        let row = new ActionRowBuilder()
        .addComponents(new ButtonBuilder().setLabel("Beni Davet Et").setStyle(ButtonStyle.Link).setURL(config.botSettings.aouthURL))

        await interaction.reply({content: `İşte davet etmen için bir seçenek. Eğer altta seçenek bulunmuyorsa profilime girip **sunucuya ekle** seçeneğine tıklayabilirsin.`, components: [row]}).catch(() => {})
    }
 };