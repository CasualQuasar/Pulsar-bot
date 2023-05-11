const fs = require('node:fs');
const path = require('node:path');

const misc = require('../botMisc.js')
const chalk = require('chalk');

let count = 0;

module.exports = (client) => {
    console.log(misc.dimmed('Loading events...'))

    //Find all of the event files that end with '.js' in all directories under events
    const loadDir = (dir) => {
        const eventsPath = path.join(__dirname, '../events/', dir);
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for(const file of eventFiles) {
            count++;
            const filePath = path.join(eventsPath, file);
            const event = require(filePath)
            const eventName = file.split('.')[0];

            if ('execute' in event) {
                client.on(eventName, event.execute)
                console.log(misc.success('Loaded ' + dir + ' event ') + chalk.magenta('[' + eventName + ']'))
            } else {
                count--;
                console.log(misc.warning(`The command at ${filePath} is missing a required or "execute" property.`));
            }
        }
    }
    
    loadDir('client');
    loadDir('guild');

    console.log('Finished loading ' + chalk.cyan(count) + ' events!')
}