//Author: MrV1ct0r

const { SlashCommandBuilder } = require('discord.js');
const { createAudioResource } = require('@discordjs/voice');
const misc = require('../botMisc.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Shuffles the queue in a random order.')
    .addBooleanOption((option) => option.setName('skip').setDescription('Should skip to the next song or continue playing?')),
	async execute(interaction) {
		await interaction.deferReply();
        if (await misc.initializeCommand(interaction)) {return};

        const shouldSkip = interaction.options.getInteger('skip');
        let client = interaction.client;
        let voiceInfo = client.queue.get(interaction.guildId)
        let player = voiceInfo.voice.player;
            

        let currentIndex = voiceInfo.queueInfo.currentTrack;
        let shuffledQueue = [voiceInfo.queue[currentIndex]]; // Set the first song as the current track
        let remainingSongs = voiceInfo.queue.slice(0, currentIndex).concat(voiceInfo.queue.slice(currentIndex + 1)); // Get the remaining songs

        // Shuffle the remaining songs
        for (let i = remainingSongs.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [remainingSongs[i], remainingSongs[randomIndex]] = [remainingSongs[randomIndex], remainingSongs[i]];
        }

        shuffledQueue = shuffledQueue.concat(remainingSongs); // Combine the first song and the shuffled remaining songs
        voiceInfo.queue = shuffledQueue; // Update the queue with the shuffled songs
        voiceInfo.queueInfo.currentTrack = 0; // Reset the current track to the first song in the shuffled queue



        //skip if necessary
        if (shouldSkip) {

            if(voiceInfo.queue[voiceInfo.queueInfo.currentTrack + ((shouldSkip) ? 1 : 0)]) {
                
                voiceInfo.queueInfo.currentTrack += (shouldSkip) ? 1 : 0;

                let musicOut = await voiceInfo.queue[voiceInfo.queueInfo.currentTrack];
                let musicFile = `[${musicOut.display_id}]-${musicOut.epoch}.opus`
                let resource = createAudioResource(`bin/${interaction.guildId}/ytdl/${musicFile}`);
                await player.play(resource);

                await interaction.editReply({
                    "embeds": [
                        {
                            "type": "rich",
                            "title": `Shuffled the playlist ${(shouldSkip) ? " and skipped to the next song!" : "!"}`,
                            "color": 0xe67c00,
                        },
                    ]
                });

            } else {//loop if no track left
                voiceInfo.queueInfo.voiceInfo.queueInfo.currentTrack = 0;
                let musicOut = await client.queue.get(interaction.guildId).queue[voiceInfo.queueInfo.currentTrack];
                let musicFile = `[${musicOut.display_id}]-${musicOut.epoch}.opus`
                let resource = createAudioResource(`../bin/${interaction.guildId}/ytdl/${musicFile}`);
                await player.play(resource);

                await interaction.editReply({
                "embeds": [
                    {
                        "type": "rich",
                        "title": `Shuffled the playlist ${(shouldSkip) ? " and skipped to the next song!" : "!"}`,
                        "color": 0xe67c00,
                    },
                ]
                });
            }   
            
        } else {
            await interaction.editReply({
                "embeds": [
                    {
                        "type": "rich",
                        "title": `Shuffled the playlist!`,
                        "color": 0xe67c00,
                    },
                ]
            });
        }

    },
	type: 1,
};