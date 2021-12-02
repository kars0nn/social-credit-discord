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
            .setDescription(`Nononono!!! You work 100 for hour! No mo! Wait wone hour!`)
        message.channel.send(embed)
    } else {

        //command here ----




        
        // ---- 

        talkedRecently.add(message.author.id);
        setTimeout(() => {
            talkedRecently.delete(message.author.id);
        }, 3600000);
    }

}

module.exports.help = {
    name: "template",
    aliases: [""]
}