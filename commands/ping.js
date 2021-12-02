const Discord = require('discord.js');
const fs = require("fs");

module.exports.run = async (client, message, args) => {

    const pre = new Discord.MessageEmbed()
        .setDescription("乒?")
    const m = await message.channel.send(pre);

    const aft = new Discord.MessageEmbed()
        .setDescription(`乒乓! - ${m.createdTimestamp - message.createdTimestamp}ms`)
        .setColor(0x61ff00)
    m.edit(aft)
}

module.exports.help = {
    name: "ping",
    aliases: ["乒"]
}