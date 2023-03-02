const { Schema, model } = require('mongoose')
const config = require('../config.json')

const data = new Schema({

    guildID: String,
    totalVote: {type: Number, default: 0},
    guildInviteLink: {type: String, default: null},

    levelSystemActivated: {type: Boolean, default: false},
    levelChannel: String,

    voteRole: {type: String, default: "Bulunamadı"}
})

module.exports = model("RoServerSettings", data);