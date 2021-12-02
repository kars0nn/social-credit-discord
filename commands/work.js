const Discord = require('discord.js');
const config = require("../config.json");
const mongoose = require('mongoose');
const User = require('../models/user');
const talkedRecently = new Set();

module.exports.run = async (client, message, args) => {

    if (talkedRecently.has(message.author.id)) {
        const embed = new Discord.MessageEmbed()
            .setColor(0xd80909)
            .setAuthor(`婊子不!`)
            .setThumbnail(`https://clipartcraft.com/images/emoji-clipart-angry-13.png`)
            .setDescription(`Nononono!!! You wouk 200 fo 1 minute! No mo! Wait 1 minute!`)
        message.channel.send(embed)
    } else {

        User.findOneAndUpdate({
            userID: message.author.id
        }, {
            $inc: {
                socialCredit: 200
            }
        }).then(user => {
            if(!user) {
                const newUser = new User({
                    userID: message.author.id,
                    username: message.author.tag,
                    url: message.author.avatarURL(),
                    socialCredit: 200
                })
                newUser.save().then(user1 => {
                    const embed = new Discord.MessageEmbed()
                    .setColor(0x19e710)
                    .setAuthor(`在社会信用中增加 200!`)
                    .setThumbnail(`https://www.funny-emoticons.com/files/smileys-emoticons/funny-emoticons/32-well-done.png`)
                    .setDescription(`**+200!**\n\n社会信用现在是 - **${user1.socialCredit + 200}**`)
                    message.channel.send(embed)
                })
            } else {
                const embed = new Discord.MessageEmbed()
                    .setColor(0x19e710)
                    .setAuthor(`在社会信用中增加 200!`)
                    .setThumbnail(`https://www.funny-emoticons.com/files/smileys-emoticons/funny-emoticons/32-well-done.png`)
                    .setDescription(`**+200!**\n\n社会信用现在是 - **${user.socialCredit + 200}**`)
                message.channel.send(embed)
                talkedRecently.add(message.author.id);
                setTimeout(() => {
                    talkedRecently.delete(message.author.id);
                }, 60000);
            }
            })
        }
    }

module.exports.help = {
    name: "work",
    aliases: ["boost"]
}
