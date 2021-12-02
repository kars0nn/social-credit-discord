const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const client = new Discord.Client({disableEveryone:true});
const listener = require('./event/messages.js');
const mongoose = require("mongoose");
const dashboard = require('./Dashboard/server');


mongoose.connect('mongodb://localhost/china', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log('connected to user database'))

client.once('ready', async () => {
    await dashboard.start(client);
    await listener.start(client)
	console.log(`${client.user.username} is online on ${client.guilds.cache.size} servers!`);
    client.user.setActivity('饭馆WARS', { type: 'COMPETING' })
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
        return console.log("no commands found");
    }

    jsfile.forEach((f) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        client.commands.set(props.help.name, props);

        props.help.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        })
    })
})

client.on("message", async message => {
    if(message.channel.type === "dm") return;
    if(message.author.id === client.user.id) return;

    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
    if(!prefixes[message.guild.id]){
        prefixes[message.guild.id] = {
            prefix: config.prefix
        }
    }
    let prefix = prefixes[message.guild.id].prefix;

    if(!message.content.startsWith(prefix)) return;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    let command;

    if(client.commands.has(cmd)){
        command = client.commands.get(cmd);
    } else if(client.aliases.has(cmd)){
        command = client.commands.get(client.aliases.get(cmd));
    }

    try{
        command.run(client, message, args);
    } catch (e){
        return;
    }
})


client.login(config.token);
