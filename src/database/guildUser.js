const { Schema, model } = require('mongoose')
const config = require('../config.json')

const data = new Schema({

    guildID: String,
    userID: String,
    totalVote: {type: Number, default: 0},
    lastVoteTimestamp: {type: Number, default: Date.now() - 60 * 60 * 24 * 2},

    xp: {type: Number, default: 0},
    requiredXP: {type: Number, default: 100},
    level: {type: Number, default: 1}
    

})

module.exports = model("RoGuildUserData", data);