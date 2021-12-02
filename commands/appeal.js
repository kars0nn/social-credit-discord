const Discord = require('discord.js');
const config = require("../config.json");
const mongoose = require('mongoose');
const User = require('../models/user');

module.exports.run = async (client, message, args) => {

    const embed = new Discord.MessageEmbed()
        .setAuthor(`Who being bad citizen...`)
        .setThumbnail('https://amogus.monster/images/bad.png')
        .setTitle('好消息！你可以上诉你的负面信用！')
        .setDescription('请访问 https://karsonn.gay/appeal to继续!')
    message.channel.send(embed)

}

module.exports.help = {
    name: "appeal",
    aliases: ["getback", "a"]
}