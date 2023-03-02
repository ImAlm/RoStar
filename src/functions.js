const moment = require('moment')
require('moment-duration-format')
moment.locale("tr")

const config = require('./config.json')
const client = global.client
const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType, ChannelType, PermissionFlagsBits, ThreadChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed, ActivityType } = require("discord.js");

module.exports = {

    sendError: async function( err, fileName ) {

        let regEx = fileName.replace(/^.*?([^\\\/]*)$/, '$1');

        let embed = new EmbedBuilder()
        .setDescription(`**${moment(Date.now()).format("LLL")} tarihinde bir hata ile karşılaşıldı. Detaylar belirtildi.**\n\`\`\`${err}\n\nEvent Failed From : ${regEx}\`\`\``)
        .setColor(config.colors.gray)

        let errChannel = client.channels.cache.get(config.channels.errorChannel)
        if (errChannel) errChannel.send({embeds: [embed]}).catch(() => {})
    }
}