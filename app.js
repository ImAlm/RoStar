const { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, PermissionsBitField } = require("discord.js");
const client = global.client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember]});

const fs = require('fs')
const mongoose = require('mongoose')
const config = require('./src/config.json')
const { readdirSync } = require("fs")
const { REST } = require('@discordjs/rest');
const { Routes, ButtonStyle, PermissionFlagsBits } = require('discord-api-types/v10');

client.commands = new Collection()

const rest = new REST({ version: '10' }).setToken(config.botSettings.token);

const commands = [];
readdirSync('./src/commands').forEach(async file => {
  const command = require(`./src/commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
})

client.on("ready", async () => {
        try {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
        } catch (error) {
            console.error(error);
        }
})

fs.readdir('./src/events/', (err, files) => {

    if (err) console.error(err);
    files.filter(x => x.endsWith(".js")).forEach(file => {

        let prop = require(`./src/events/${file}`);
        if (!prop.conf) return;
        client.on(prop.conf.name, prop);
    })
})

client.login(config.botSettings.token).then(x => {
    console.log(`[ BOT ] - Sistem başarıyla aktif oldu.`)
}).catch(err => {
    console.log(`[ HATA ] - Sistem başlatılırken bir hata ile karşılaşıldı.`)
})

mongoose.set('strictQuery', false)
mongoose.connect(
    config.API.mongoKey,
    {
        keepAlive: true,
    }
).then(x => console.log(`[ Database ] - Başarılı bir şekilde veritaban bağlantısı gerçekleştirildi.`))
.catch(() => console.log(`[ Database ] - Veritabanına erişim sağlanamadı.`))