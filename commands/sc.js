const Discord = require('discord.js');
const config = require("../config.json");
const mongoose = require('mongoose');
const User = require('../models/user');

module.exports.run = async (client, message, args) => {
    
    let mention = message.mentions.users.first();
    if(!mention) {
        User.findOne({ userID: message.author.id }).then(user => {
            if(!user) {
                const newUser = new User({
                    userID: message.author.id,
                    username: message.author.tag,
                    url: message.author.avatarURL()
                })

                newUser.save().catch(err => console.log(err))

                const embed = new Discord.MessageEmbed()
                    .setColor(0x19e710)
                    .setAuthor(`社會信用 - ${message.author.username}`, message.author.avatarURL())
                    .setThumbnail('https://amogus.monster/images/good.png')
                    .setTitle('0')
                    .setDescription('好!')
                message.channel.send(embed)
            } else {

                if(user.socialCredit >= 1) {
                    const embed = new Discord.MessageEmbed()
                    .setColor(0x19e710)
                    .setAuthor(`社會信用 - ${message.author.username}`, message.author.avatarURL())
                    .setThumbnail('https://amogus.monster/images/good.png')
                    .setTitle(`${user.socialCredit}`)
                    .setDescription('堅持住，兄弟！所有這些白癡永遠不會知道擁有社會信用是什麼感覺！')
                    message.channel.send(embed)
                } else if(user.socialCredit <= 1) {
                    const embed = new Discord.MessageEmbed()
                    .setColor(0xe71020)
                    .setAuthor(`社會信用 - ${message.author.username}`, message.author.avatarURL())
                    .setThumbnail('https://amogus.monster/images/bad.png')
                    .setTitle(`${user.socialCredit}`)
                    .setDescription('你最好修好你哥哥！繼續，你最終像亞伯拉罕。林肯也一個')
                    message.channel.send(embed)
                }
            }
        })
    }

}

module.exports.help = {
    name: "socialcredit",
    aliases: ["sc", "credit"]
}
