const Discord = require('discord.js');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const config = require('./config.json');

const prefix = '%';

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
//////////////////////////////////////////////////////////////////////////

function createCode(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

//////////////////////////////////////////////////////////////////////////

client.on('message', message => {
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);
    
//////////////////////////////////////////////////////////////////////////

    try{
        command.execute(message, args, client, createCode(8));
        console.log(`User ${message.author.username} ( userid: ${message.author.id} ) used command ${commandName} with args: ${args}`);
    }catch (error){
        console.log(error);
        message.reply('Nie udało się wykonać komendy');
    }
});

//////////////////////////////////////////////////////////////////////////

client.on('ready', () => {
    client.user.setActivity("Wpisz $!kod na kanale #kody, aby otrzymać kod i link do głosowania!");
    console.log(`Logged in as ${client.user.tag}!`);
});
    
    
client.login(config.TOKEN);