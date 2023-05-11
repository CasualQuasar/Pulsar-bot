const fs = require('node:fs');
const path = require('node:path');

const misc = require('../botMisc.js')
const chalk = require('chalk');

let count = 0;

module.exports = (client) => {
    console.log(misc.dimmed('Loading commands...'))

    //Find all of the command files that end with '.js'
    const commandsPath = path.join(__dirname, '../commands/');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        count++;
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(misc.success('Loaded command ') + chalk.magenta('[' + command.data.name + ']'))
        } else {
            count--;
            console.log(misc.warning(misc.warning(`The command at ${filePath} is missing a required "data" or "execute" property.`)));
        }
    }

    console.log('Finished loading ' + chalk.cyan(count) + ' commands!')
}