const Discord = require('discord.js');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const config = require("../config.json");

module.exports = {
    name: 'setchannel',
    description: 'Linkuje kanał do głosowania',
    args: true,
    execute(message, args) {
        if(!message.member.hasPermission('ADMINISTRATOR')) return;
        let db = new sqlite3.Database('./db/codes.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        });

        db.get(`SELECT * FROM channels WHERE guildId='${message.guild.id}'`, (err, row) => {
            if(err){
                return console.error(err.message);
            }
            let query;
            if(row){
                query = `UPDATE channels SET channelId='${args[0]}' WHERE guildId='${message.guild.id}'`;
            }
            else{
                query = `INSERT INTO channels (guildId, channelId) VALUES ('${message.guild.id}', '${args[0]}')`;
            }

            db.all(query, (err) => {
                if (err) {
                  return console.error(err.message);
                }
                else{
                    message.reply(`Pomyślnie ustawiono kanał na id ${args[0]}`);
                }
            });
        });
        
        db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        });
    },
};