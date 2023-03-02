const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType, ChannelType, PermissionFlagsBits, ThreadChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed } = require("discord.js");
const { SlashCommandBuilder, channelLink } = require("@discordjs/builders");
const config = require("../config.json")
const guildSettings = require('../database/guildSettings')

module.exports = {
  // Owo 
  data: new SlashCommandBuilder()
    .setName("setinvite_link")
    .addStringOption(x => x.setName("invitelink").setDescription("Sunucunun invite linkini giriniz.").setRequired(true))
    .setDescription("Sunucunun invite linkini ayarlar."),

    run: async (client, interaction, functions) => {

        let member = interaction.member
        if (!member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.editReply({embeds: [new EmbedBuilder().setColor(config.colors.gray).setDescription(`${config.emojis.reddet} Bu komutu kullanabilmen için gerekli yetkiye sahip olmalısın.`)], ephemeral: true})

        let url = interaction.options.getString("invitelink")
        if (!url.includes("https:")) return interaction.reply({content: `Davet linkinde https tagı bulunmalıdır. Örnek kullanım : \`https://discord.com/invite/roland\``, ephemeral: true})
        if (!url.includes("discord.gg/")) return interaction.reply({content: `Davet linkinde discord.gg/ tagı bulunmalıdır. Örnek kullanım : \`https://discord.com/invite/roland\``, ephemeral: true})
        let guildData = await guildSettings.findOne({guildID: interaction.guild.id})

        let embed = new EmbedBuilder()
        .setColor(config.colors.gray)
        .setDescription(`${config.emojis.onay} Yeni invite linki **${url}** olarak ayarlandı.`)
        await guildSettings.findOneAndUpdate({guildID: interaction.guild.id}, {$set: {guildInviteLink: url}}, {upsert: true})

        await interaction.reply({embeds: [embed]})
    }
 };