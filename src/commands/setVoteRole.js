const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType, ChannelType, PermissionFlagsBits, ThreadChannel } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../config.json")
const guildSettings = require('../database/guildSettings')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("voterole_setup")
    .addRoleOption((x) => x.setName("rol").setDescription("Bir tane rol seçiniz.").setRequired(true))
    .setDescription("Oy verenlere otomatik rol verir."),

    run: async (client, interaction) => {
      
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return await interaction.reply({content: `Bu komutu kullanabilmek için \`yönetici\` yetkisine sahip olmalısınız.`, ephemeral: true})
        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) return await interaction.reply({content: `Sunucuda \`rolleri yönet\` yetkim bulunmadığı için işlem devam edilemedi.`, ephemeral: true})

        let roleId = interaction.options.get("rol").value
        
        let embed = new EmbedBuilder()
        .setAuthor({name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({dynamic: true})})
        .setDescription(`Oy verildikten sonra verilecek rol <@&${roleId}> olarak ayarlandı.`)
        .setColor(config.colors.green)

        await interaction.reply({embeds: [embed]}).catch(() => {})

        await guildSettings.findOneAndUpdate({guildID: interaction.guild.id}, {$set: {voteRole: roleId}}, {upsert: true})
    }
 };