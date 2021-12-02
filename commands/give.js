const Discord = require('discord.js');
const config = require("../config.json");
const mongoose = require('mongoose');
const User = require('../models/user');

module.exports.run = async (client, message, args) => {

    if(message.author.id !== config.owner) {
        message.channel.send("不")
    } else {
        let mention = message.mentions.users.first();
        let amount = args[1]

        User.findOneAndUpdate({userID:mention.id}, {
            $inc:{
                socialCredit: amount
            }
        }).then(user => {
            message.channel.send("巨大的成功!")
        }).catch(err => {
            console.log(err)
            message.channel.send("error!")
        })
    }

}

module.exports.help = {
    name: "give",
    aliases: ["add", "gift"]
}