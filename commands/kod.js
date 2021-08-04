const Discord = require('discord.js');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const config = require("../config.json");

module.exports = {
    name: 'kod',
    description: 'Wysyła kod do głosowania',
    args: true,
    execute(message, args, client, kodzik) {
        let db = new sqlite3.Database('./db/codes.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        });

        function sendCode(code){
            db.get(`SELECT * FROM links WHERE guildId='${message.guild.id}'`, (err, row) => {
                if(err){
                    return console.error(err.message);
                }
                if(row){
                    var embedMessage = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Rozpoczeły się wybory!')
                        .setDescription(`Wejdź na ${row.link} i wybierz zgodnie ze swoim sumieniem`)
                        .addField('Twój kod do głosowania', "`"+code+"`", true)
                        .setTimestamp()
                        .setFooter('Bot by Kieszyk', 'https://i.pinimg.com/736x/f9/e6/f7/f9e6f75137d0f3902f3dd32a287f9e10.jpg')
                    message.author.send(embedMessage)
                    client.channels.cache.get('838428945518297098').send('Wysłano kod `'+code+'` do '+message.author.username+', id użytkownika: '+ message.author.id);
                }
            });
        }

        let query = `SELECT * FROM channels WHERE guildId='${message.guild.id}'`;
        db.get(query, (err, row) => {
            if (err) {
              return console.error(err.message);
            }
            if(row){
                if(row.channelId == message.channel.id){
                    let query = `SELECT * FROM users WHERE userId='${message.author.id}' AND guildId='${message.guild.id}'`;
                    db.get(query, (err, row) => {
                        if (err) {
                        return console.error(err.message);
                        }
                        if(row){
                            sendCode(row.kod);
                        }
                        else{
                            let query = `INSERT INTO users (userId, guildId, kod) VALUES ('${message.author.id}', '${message.guild.id}', '${kodzik}')`;
                            db.all(query, (err) => {
                                if (err) {
                                    return console.error(err.message);
                                }
                                else{
                                    sendCode(kodzik);
                                }
                            });
                        }
                    });
                }
                else{
                    console.log("Zły kanał");
                }
            }
        });

        db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        });
    },
};