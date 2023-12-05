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
		

    //shuffle
    let currentIndex = voiceInfo.queueInfo.currentTrack;
    let shuffledQueue = voiceInfo.queue;
    let temp;
    let randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      temp = shuffledQueue[currentIndex];
      shuffledQueue[currentIndex] = shuffledQueue[randomIndex];
      shuffledQueue[randomIndex] = temp;
    }
    voiceInfo.queue = shuffledQueue;


    //skip if necessary
    if(voiceInfo.queue[voiceInfo.queueInfo.currentTrack + (shouldSkip) ? 1 : 0]) {
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
    }},
	type: 1,
};