const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType, ChannelType, PermissionFlagsBits, ThreadChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed } = require("discord.js");
const config = require("../config.json")
const ascii = require('ascii-table')
const guildSettings = require('../database/guildSettings')
const guildUser = require('../database/guildUser')
const client = global.client

module.exports = async (interaction) => {

    if (interaction.customId === "guildList") {
        if (!interaction.values) return interaction.reply({content: `Birşeyler ters gitti. Lütfen geliştirici ekibine belirtiniz.`, ephemeral: true})
        let value = interaction.values[0]
        let guild = client.guilds.cache.get(value)
        if (!guild) return interaction.reply({content: `Bu sunucuya erişim sağlanamamaktadır. Lütfen geliştirici ekibine belirtiniz.`, ephemeral: true})

        const data = await guildSettings.findOne({guildID: guild.id})
        if (!data) return interaction.reply({content: `Bu sunucuya erişim sağlanamamaktadır. Lütfen geliştirici ekibine belirtiniz.`, ephemeral: true})
        let embed = new EmbedBuilder()
        .setAuthor({name: `${guild.name}`, iconURL: guild.iconURL({dynamic: true})})
        .setColor(config.colors.gray)
        .addFields(
            { name: `Kullanıcı Sayısı`, value: `\`🗒️ ${guild.memberCount} \``, inline: true},
            { name: `Aktif Üye Sayısı`, value: `\`🟢 ${guild.members.cache.filter(x => x.presence).size} \``, inline: true},
            { name: `Kurulma Tarihi`, value: `${config.emojis.saat} <t:${Math.floor(guild.createdTimestamp / 1000)}:D> `, inline: true}, // <t:0:D>
            { name: `Oy`, value: ` \`❤️ ${data ? data.totalVote : 0}\` `, inline: true}, // <t:0:D>
            { name: `Davet URL'si`, value: ` 🔗 Gitmek için [tıkla](${data.guildInviteLink}) `, inline: true},
            { name: `Sunucu Sahibi`, value: ` ${config.emojis.taç} <@${guild.ownerId}>`, inline: true},
        )

        let row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setLabel("Sunucuya Katıl").setURL(data.guildInviteLink).setStyle(ButtonStyle.Link).setEmoji("🔗")
        )

        interaction.reply({embeds: [embed], components: [row], ephemeral: true})
    }
}

module.exports.conf = {
    name: "interactionCreate"
}