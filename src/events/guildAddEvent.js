const config = require('../config.json')
const { EmbedBuilder } = require('discord.js')
const client = global.client

module.exports = (guild) => {
  
    let embed = new EmbedBuilder()
    .setAuthor({name: guild.name, iconURL: guild.iconURL({dynamic: true})})
    .setDescription(`• Yeni bir sunucuya eklendim.\n\n`
    + `${config.emojis.zil}** | Sunucu Bilgisi**\n`
    + `> **• Sunucu Adı : **${guild.name}\n`
    + `> **• Sunucu ID : **${guild.id}\n`
    + `> **• Kişi Sayısı : **${guild.memberCount}\n`
    + `> **• Sunucu Sahibi : **<@${guild.ownerId}>\n`
    )
    .setTimestamp()
    .setColor(config.colors.gray)
    .setFooter({text: `${client.user.username} Guild - Create`, iconURL: client.user.avatarURL({dynamic: true})})

    let channel = client.channels.cache.get(config.channels.guildEvents)
    if (channel) channel.send({embeds: [embed]}).catch(() => {})
}

module.exports.conf = {
  name: "guildCreate"
}