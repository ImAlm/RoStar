const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType, ChannelType, PermissionFlagsBits, ThreadChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed } = require("discord.js");
const config = require("../config.json")
const ascii = require('ascii-table')
const guildSettings = require('../database/guildSettings')
const guildUser = require('../database/guildUser')

module.exports = async (interaction) => {

    if (!interaction.guild || !interaction.member || !interaction.member.user || interaction.member.user.bot) return;
    if (interaction.customId === "oy-ver") {

        await interaction.deferReply({ephemeral: true});
        let ownData = await guildUser.findOne({guildID: interaction.guild.id, userID: interaction.member.id})
        let guildData = await guildSettings.findOne({guildID: interaction.guild.id})

        if (ownData && ( Date.now() - ownData.lastVoteTimestamp < 1000 * 60 * 60 * 24 )) {
            let embed = new EmbedBuilder()
            .setAuthor({name: interaction.member.displayName, iconURL: interaction.member.user.avatarURL({dynamic: true})})
            .setColor(config.colors.gray)
            .setDescription(`${config.emojis.reddet} Bugün oy kullandınız. Lütfen <t:${Math.floor((ownData.lastVoteTimestamp + 1000 * 60 * 60 * 24) / 1000)}:F> tarihine kadar bekleyin.`)
            return await interaction.editReply({embeds: [embed]})
        }

        await guildSettings.findOneAndUpdate({guildID: interaction.guild.id}, {$inc: {totalVote: 1}}, {upsert: true})
        await guildUser.findOneAndUpdate({guildID: interaction.guild.id, userID: interaction.member.id}, {$inc: {totalVote: 1}}, {upsert: true})
        await guildUser.findOneAndUpdate({guildID: interaction.guild.id, userID: interaction.member.id}, {$set: {lastVoteTimestamp: Date.now()}}, {upsert: true})

        /// Pull Data

        let newGuildData = await guildSettings.findOne({guildID: interaction.guild.id})
        let newOwnData = await guildUser.findOne({guildID: interaction.guild.id, userID: interaction.member.id})
        let curData = (await guildUser.find({guildID: interaction.guild.id})).slice(0, 15).sort((a, b) => b.totalVote - a.totalVote).filter(x => interaction.guild.members.cache.get(x.userID) && x.totalVote > 0)

        let table = new ascii()
        table.removeBorder()
        table.setHeading("##","OY ❤️","OY VERENLER")
        table.setHeadingAlign(ascii.LEFT)
    
        if (curData && curData.length > 0) {
            curData.forEach((x, index) => {
              table.addRow(`${index + 1}.`, `${x.totalVote} ❤️`, `${interaction.guild.members.cache.get(x.userID).user.tag.replace("`","")}`)
            })
        }
        table.sort(function(a, b) {
            return b[0] - a[a]
        })

        let embed = new EmbedBuilder()
        .setAuthor({name: interaction.guild.name + " Adlı Sunucunun En Çok Oy Verenleri", iconURL: interaction.guild.iconURL({dynamic: true})})
        .setDescription(`**01.02.2023 - 01.03.2023** tarihleri arasında en çok oy verenler.\`\`\`md\n${curData?.length > 0 ? table : " Oy Veren Kişi Bulunamadı."}\`\`\`\n\`\`\`js\nㅤBU AY TOPLAM ${newGuildData ? newGuildData.totalVote : 0} OY ❤️\`\`\`\n**${config.emojis.zil} En son <t:${Math.floor(Date.now() / 1000)}:R> oy verildi.**`)
        .setColor(config.colors.gray)

        var row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("oy-ver").setEmoji(config.emojis.onay).setLabel(`SUNUCUYA OY VER`).setStyle(ButtonStyle.Secondary).setDisabled(false)
        )
    
        let basarili = new EmbedBuilder()
        .setAuthor({name: interaction.member.displayName, iconURL: interaction.member.user.avatarURL({dynamic: true})})
        .setDescription(`${config.emojis.onay} Başarılı bir şekilde **+1** oy verdin. Bu zamana kadar toplam \`${newOwnData ? newOwnData.totalVote : 1}\` oy verdin.\n${config.emojis.saat} Bir sonraki oy verme tarihin <t:${Math.floor((Date.now() + 1000 * 60 * 60 * 24) / 1000)}:F> olarak ayarlandı.`)
        .setColor(config.colors.gray)
        .setTimestamp()

        await interaction.editReply({embeds: [basarili]}).catch(() => {})
        await interaction.message.edit({embeds: [embed], components: [row]})

        let gData = await guildSettings.findOne({guildID: interaction.guild.id})
        if (gData && interaction.guild.roles.cache.get(gData.voteRole)) {
            await interaction.member.roles.add(gData.voteRole).catch(() => {})
        }
    }
}

module.exports.conf = {
    name: "interactionCreate"
}