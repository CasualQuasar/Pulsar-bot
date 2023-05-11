const {createAudioPlayer } = require('@discordjs/voice');
const fs = require('node:fs');
const path = require('node:path');

const chalk = require('chalk');
const dimmed = chalk.gray;
const success = chalk.green;
const chalkWarning = chalk.hex('#FFA500');
const chalkError = chalk.bold.red;

module.exports = {
    dimmed,
    success,
    warning(string) { return chalkWarning("[WARNING] - " + string); },
    error(string) { return chalkError("[ERROR] - " + string); },

    async verifyGuildQueue(interaction) {
        verifyGuildQueue(interaction);
    },
    async initializeCommand(interaction) {
        let shouldAbort = false;
        verifyGuildQueue(interaction);
        await verify(interaction).then((val) => { shouldAbort = val})
        interaction.client.queue.get(interaction.guildId).recentTextChannel = interaction.channel
        return shouldAbort;
    },
    async initializePlayCommand(interaction) {
        let shouldAbort = false;
        verifyGuildQueue(interaction);
        await verifyPlay(interaction).then((val) => { shouldAbort = val})
        interaction.client.queue.get(interaction.guildId).recentTextChannel = interaction.channel
        return shouldAbort;
    },
    async clearSongs(guildId) {
        console.log(dimmed("Clearing songs under guild ID ") + chalk.blue(guildId))
        if(fs.existsSync(`./bin/${guildId}/ytdl`))
            fs.readdir(`./bin/${guildId}/ytdl/`, (err, files) => {
                if (err) throw err;
            
                for (const file of files) {
                    fs.unlink(path.join(`bin/${guildId}/ytdl/`, file), (err) => {
                    if (err) throw err;
                    });
                }
            });
        if(fs.existsSync(`./bin/${guildId}/sdl`))
            fs.readdir(`./bin/${guildId}/sdl/`, (err, files) => {
                if (err) throw err;
            
                for (const file of files) {
                    fs.unlink(path.join(`bin/${guildId}/sdl/`, file), (err) => {
                        if (err) throw err;
                    });
                }
            });
        if(fs.existsSync(`./bin/${guildId}/discord`))
            fs.readdir(`./bin/${guildId}/discord/`, (err, files) => {
                if (err) throw err;
                
                for (const file of files) {
                    fs.unlink(path.join(`bin/${guildId}/discord/`, file), (err) => {
                        if (err) throw err;
                    });
                }
            });
    },
    async disconnect(interaction, description) {
        let client = interaction.client;
        if(!await client.queue.get(interaction.guildId))
            return;

        let channel = await client.queue.get(interaction.guildId).recentTextChannel

       channel.send({
        "embeds": [
            {
                "type": "rich",
                "title": `Succesfully destroyed the player!`,
                "description": description,
                "color": 0xe67c00,
            },
        ]
        });

        let player = client.queue.get(interaction.guildId).voice.player;
        let voiceConnection = client.queue.get(interaction.guildId).voice.connection;

        voiceConnection.destroy();
        player.removeAllListeners();
        voiceConnection.removeAllListeners();
        client.queue.delete(interaction.guildId);
        this.clearSongs(interaction.guildId)
    },
};

function verify(interaction) {
    const promise = new Promise((resolve, reject) => {
        
        client = interaction.client;
            
        if(!interaction.member.voice.channelId) {
            interaction.editReply({
                "embeds": [
                    {
                        "type": "rich",
                        "title": "Error",
                        "description": "You need to join a voice channel!",
                        "color": 0xe67c00,
                    },
                ]
            });
            resolve(true);
        } else if (!client.queue.get(interaction.guildId).voice.voiceChannelId){
            interaction.editReply({
                "embeds": [
                    {
                        "type": "rich",
                        "title": "Error",
                        "description": "The bot needs to be in a voice channel!",
                        "color": 0xe67c00,
                    },
                ]
            });
            resolve(true);
        } else if(interaction.member.voice.channelId != client.queue.get(interaction.guildId).voice.voiceChannelId) {
            interaction.editReply({
                "embeds": [
                    {
                        "type": "rich",
                        "title": "Error",
                        "description": "You need to be in the same channel as the bot!",
                        "color": 0xe67c00,
                    },
                ]
            });
            resolve(true);
        } else resolve(false);
    });

    return promise;
}

function verifyPlay(interaction) {
    const promise = new Promise((resolve, reject) => {
        client = interaction.client;

        if(!interaction.member.voice.channelId) {
            interaction.editReply({
                "embeds": [
                    {
                        "type": "rich",
                        "title": "You need to join a voice channel!",
                        "color": 0xe67c00,
                    },
                ]
            });

            resolve(true);
        } else resolve(false);
    });

    return promise;
}

function verifyGuildQueue(interaction) {
    client = interaction.client;
    if(!client.queue.get(interaction.guildId))
    initializeGuildQueue(interaction);
}

function initializeGuildQueue(interaction) {
    client = interaction.client;
    client.queue.set(interaction.guildId, {
        "queue": [],
        "queueInfo": {
            "currentTrack": 0,
            "durationPassed": 0,
            "looping": 0,
        },
        "voice": {
            "voiceChannelId": null,
            "connection": null,
            "player": createAudioPlayer(),
            "idleInterval": null,
        },
        "recentTextChannel": interaction.channel
    })
}