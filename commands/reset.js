const Discord = require('discord.js');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const config = require("../config.json");

module.exports = {
    name: 'reset',
    description: 'Resetuje kody',
    args: true,
    execute(message, args) {
        if(!message.member.hasPermission('ADMINISTRATOR')) return;
        let db = new sqlite3.Database('./db/codes.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        });

        let query = `DELETE FROM users WHERE guildId='${message.guild.id}'`;

        db.all(query, (err) => {
            if (err) {
              return console.error(err.message);
            }
            else{
                message.reply(`Pomyślnie zresetowano kody`);
            }
          });

        db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        });
    },
};