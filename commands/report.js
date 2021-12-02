const Discord = require('discord.js');
const config = require("../config.json");
const mongoose = require('mongoose');
const User = require('../models/user');
var randomstring = require("randomstring")
const talkedRecently = new Set();

module.exports.run = async (client, message, args) => {

    if (talkedRecently.has(message.author.id)) {
        const embed = new Discord.MessageEmbed()
            .setColor(0xd80909)
            .setAuthor(`婊子不!`)
            .setThumbnail(`https://clipartcraft.com/images/emoji-clipart-angry-13.png`)
            .setDescription(`Nononono!!! No mo! Wait 30 minute!`)
        message.channel.send(embed)
    } else {
        let mention = message.mentions.users.first();

        if(!mention){
            const embed = new Discord.MessageEmbed()
            .setColor(0xd80909)
            .setAuthor(`骗子!!`)
            .setThumbnail(`https://clipartcraft.com/images/emoji-clipart-angry-13.png`)
            .setDescription(`没有自我报告！这不是我们当中你这个愚蠢的黑人婊子!`)
            message.channel.send(embed)
        } else {
            User.findOneAndUpdate({userID: mention.id}, {
                $inc: {
                    socialCredit: -100
                },
                $push: {
                    strikes: {
                        reason:"骗子！(Reported!)",
                        amount: 100,
                        id: randomstring.generate(30)
                    }
                }
            }).catch(err => {
                console.log(err)
            })

            const embed = new Discord.MessageEmbed()
            .setColor(0x19e710)
            .setAuthor(`干得好！- ${message.author.username}`, message.author.avatarURL())
            .setThumbnail('https://amogus.monster/images/good.png')
            .setDescription('报告给中国外事')
            message.channel.send(embed)

        }

        talkedRecently.add(message.author.id);
        setTimeout(() => {
            talkedRecently.delete(message.author.id);
        }, 1800000);
    }

}

module.exports.help = {
    name: "report",
    aliases: [""]
}