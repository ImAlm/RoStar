const { Schema, model } = require('mongoose')
const config = require('../config.json')

const data = new Schema({

    userID: String,
    premiumTimestamp: {type: Number, default: Date.now()},
})

module.exports = model("RoUserData", data);