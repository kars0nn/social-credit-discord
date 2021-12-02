const Discord = require('discord.js');
const config = require("../config.json");
const mongoose = require('mongoose');
const User = require('../models/user');

module.exports.run = async (client, message, args) => {

    usa = []
    const users = await User.find().sort({
        socialCredit: "desc"
    }).limit(10)

    for (let i = 0; i < users.length; i++) {
        usa.push([
            `**${i + 1}**. ${users[i].username} - ${users[i].socialCredit}`
        ])
    }

    const str = usa.join('\n');

    const embed = new Discord.MessageEmbed()
        .setAuthor(`社会信用LEADER-BOARD! TOP-10`)
        .setThumbnail(`${users[0].url}`)
        .setDescription(str + `\n\n[Website - Top 30](https://karsonn.gay/users)`)
    message.channel.send(embed)

}

module.exports.help = {
    name: "leaderboard",
    aliases: ["lb", "top"]
}