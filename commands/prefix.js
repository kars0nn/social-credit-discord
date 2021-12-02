const Discord = require('discord.js');
const fs = require("fs");
const config = require("../config.json");

module.exports.run = async (client, message, args) => {

    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
    if (!prefixes[message.guild.id]) {
        prefixes[message.guild.id] = {
            prefix: config.prefix
        }
    }
    let prefix = prefixes[message.guild.id].prefix;

    if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply("no")

    if (!args[0]) return message.reply("請給出一個開始字元 ! (please give me a prefix to set)").then(msg => {
        msg.delete({ timeout: 15000 }).catch(console.error);
    })

    prefixes[message.guild.id] = {
        prefix: args[0]
    }

    fs.writeFile("./prefixes.json", JSON.stringify(prefixes), (err) => {
        if (err) console.log(err);
    });

    let embed = new Discord.MessageEmbed()
        .setColor(0x15ED11)
        .setDescription(`前綴設置為 [ ${args[0]} ] 為 ${message.guild.name} ! `)
        .setFooter(`(prefix set to ${args[0]} for ${message.guild.name}!)`)
        .setTimestamp()
    message.channel.send(embed);
}

module.exports.help = {
    name: "prefix",
    aliases: ["pre"]
}