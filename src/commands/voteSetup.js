const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType, ChannelType, PermissionFlagsBits, ThreadChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed } = require("discord.js");
const { SlashCommandBuilder, channelLink } = require("@discordjs/builders");
const config = require("../config.json")

const ascii = require('ascii-table')
const guildSettings = require('../database/guildSettings')
const guildUser = require('../database/guildUser')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote_setup")
    .setDescription("Sunucuya oy sistemini kurar."),

    run: async (client, interaction, functions) => {

		await interaction.deferReply({ephemeral: true});

        let member = interaction.member
        if (!member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.editReply({embeds: [new EmbedBuilder().setColor(config.colors.gray).setDescription(`${config.emojis.reddet} Bu komutu kullanabilmen için gerekli yetkiye sahip olmalısın.`)], ephemeral: true}).catch(() => {})

        let guildData = await guildSettings.findOne({guildID: interaction.guild.id})
        if (!guildData || guildData.guildInviteLink === null) return await interaction.editReply({embeds: [new EmbedBuilder().setColor(config.colors.gray).setDescription(`${config.emojis.reddet} Sunucunun davet linki ayarlanmamış. Sunucu listesinde sunucunuz çıkması için için **\`/setinvite_link\`** komutunu kullanınız.`)], ephemeral: true}).catch(() => {})
        var row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("oy-ver")
            .setLabel(`SUNUCUYA OY VER`)
            .setStyle(ButtonStyle.Secondary)
            .setEmoji(config.emojis.onay)
        )

        let table = new ascii()
        table.removeBorder()
        table.setHeading("##","OY ❤️","OY VERENLER")
        table.setHeadingAlign(ascii.LEFT)

        let usersData = (await guildUser.find({guildID: interaction.guild.id})).slice(0, 15).sort((a, b) => b.totalVote - a.totalVote).filter(x => interaction.guild.members.cache.get(x.userID) && x.totalVote > 0)
        if (usersData && usersData.length > 0) {
            usersData.forEach((x, index) => {
              table.addRow(`${index + 1}.`, `${x.totalVote} ❤️`, `${interaction.guild.members.cache.get(x.userID).user.tag.replace("`","")}`)
            })
        }
        table.sort(function(a, b) {
          return a[1] - b[1]
        })

        // ----  let mapped = usersData.map((a => `\`  ${a.totalVote} ❤️ \` - ${interaction.guild.members.cache.get(a.userID)}`))
        let embed = new EmbedBuilder()
        .setAuthor({name: interaction.guild.name + " Adlı Sunucunun En Çok Oy Verenleri", iconURL: interaction.guild.iconURL({dynamic: true})})
        .setDescription(`**01.02.2023 - 01.03.2023** tarihleri arasında en çok oy verenler.\`\`\`md\n${usersData?.length > 0 ? table : " Oy Veren Kişi Bulunamadı."}\`\`\`\n\`\`\`js\nㅤBU AY TOPLAM ${guildData ? guildData.totalVote : 0} OY ❤️\`\`\``)
        .setColor(config.colors.gray)

        await interaction.editReply({content: `Başarılı bir şekilde kurulum tamamlandı. Oy verme yarışması başlasın!!`}).catch(() => {})

        await interaction.channel.send({components: [row], embeds: [embed]}).catch(() => {})
    }
 };