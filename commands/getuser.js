const Discord = require('discord.js');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const config = require("../config.json");

module.exports = {
    name: 'getuser',
    description: 'Wyświetla kod użytkownika',
    args: true,
    execute(message, args, client) {
        if(!message.member.hasPermission('ADMINISTRATOR')) return;
        let db = new sqlite3.Database('./db/codes.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        });
        let query = `SELECT * FROM users WHERE kod='${args[0]}'`;

        db.get(query, (err, row) => {
            if (err) {
              return console.error(err.message);
            }
            if(row){
                const user = client.users.fetch(row.userId).then((user) =>{
                    message.reply(`\`${row.kod}\` to kod przypisany do użytkownika ${user.username}`);
                }).catch(console.error)
            }
            else{
                message.reply('Podano niepoprawne dane lub nie ma takiego rekordu');
            }
          });

        db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        });
    },
};