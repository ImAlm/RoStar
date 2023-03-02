const client = global.client
const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType, ChannelType, PermissionFlagsBits, ThreadChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed, ActivityType, StringSelectMenuBuilder } = require("discord.js");
const config = require("../config.json")
const ascii = require('ascii-table')
const guildSettings = require('../database/guildSettings')
const guildUser = require('../database/guildUser')
const functions = require('../functions')
const { joinVoiceChannel } = require('@discordjs/voice')

module.exports = async () => {

    setInterval(() => {

        const guildSize = client.guilds.cache.size
        const userSize = client.users.cache.size

        client.user.setActivity(`${guildSize} Sunucu | ${userSize} Kullanıcı`, {type: ActivityType.Listening})
    }, 30000)

    const VoiceChannel = client.channels.cache.get("1070653545151471686");

	joinVoiceChannel({
	  channelId: VoiceChannel.id,
	  guildId: VoiceChannel.guild.id,
	  adapterCreator: VoiceChannel.guild.voiceAdapterCreator,
    selfDeaf: true
	});

    //////// Reset Guild Panel 

    setInterval( async () => {

        let guildData = (await guildSettings.find({})).slice(0, 25).sort((a, b) => b.totalVote - a.totalVote).filter(x => client.guilds.cache.get(x.guildID) && x.totalVote > 0 && x.guildInviteLink !== null)
        let table = new ascii()
        table.removeBorder()
        table.setHeading("##","OY SAYISI", "SUNUCULAR")
        table.setHeadingAlign(ascii.LEFT)


        table.sort(function(a, b) {
            return a[1] - b[1]
        })

        if (guildData && guildData.length > 0) {
            guildData.forEach((x, index) => {
              table.addRow(`${index + 1}.`, `${x.totalVote} OY`, `${client.guilds.cache.get(x.guildID).name.slice(0, 18).replace("`","")}`)
            })
        }

        let row = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId("guildList").setMaxValues(1).setMinValues(1).setPlaceholder("Bir sunucu seçiniz."))
        
        if (guildData && guildData.length > 0) {
            let spec = guildData.slice(0, 5)
            spec.forEach(x => row.components[0].addOptions({ value: `${x.guildID}`, emoji: config.emojis.onay, label: `${client.guilds.cache.get(x.guildID).name}` }))
        }

        let total = await guildSettings.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$totalVote"
                    }
                }
            }
        ])
        
        let embed = new EmbedBuilder()
        .setAuthor({name: `En Fazla Oy Alan 25 Sunucu`, iconURL: client.user.avatarURL({dynamic: true})})
        .setColor(config.colors.gray)
        .setDescription(`\`\`\`arm\n${guildData?.length > 0 ? table : " SUNUCU BULUNAMADI."}\`\`\`\n\`\`\`js\n BU AY TOPLAM ${total.length > 0 ? (total[0].total) : 0} OY ❤️\`\`\``)
        .setImage("https://cdn.johnbot.app/img/imghelp.png")

        try {
            const topChannel = await client.channels.cache.get(config.channels.top25message.channelId)
            if (!topChannel) return functions.sendError("Top 25 kanalı bulunamadı. Lütfen kanal ID'sini düzeltiniz.", __filename)

            let message = await topChannel.messages.fetch(config.channels.top25message.messageId)
            await message.edit({content: null, embeds: [embed], components: guildData.length > 0 ? [row]: []}).catch((err) => { return functions.sendError("Top 25 mesajı bulunamadı. Lütfen mesaj ID'sini düzeltiniz.", __filename) })
        } catch (err) {

        }
        
    }, 15 * 1000)
}

module.exports.conf = {
    name: "ready"
}