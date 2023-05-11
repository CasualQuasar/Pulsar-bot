const { SlashCommandBuilder } = require('discord.js');
const { createAudioResource } = require('@discordjs/voice');
const misc = require('../botMisc.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skips to the next track if there is one.'),
	async execute(interaction) {
		await interaction.deferReply();
        if (await misc.initializeCommand(interaction)) {return};

		let client = interaction.client;
    let voiceInfo = client.queue.get(interaction.guildId)
		let player = voiceInfo.voice.player;
    // let currentTrack = voiceInfo.queueInfo.currentTrack
		
    if(voiceInfo.queue[voiceInfo.queueInfo.currentTrack + 1]) {
      voiceInfo.queueInfo.currentTrack++;

      let musicOut = await voiceInfo.queue[voiceInfo.queueInfo.currentTrack];
      let musicFile = `[${musicOut.display_id}]-${musicOut.epoch}.opus`
      let resource = createAudioResource(`bin/${interaction.guildId}/ytdl/${musicFile}`);
      await player.play(resource);

      await interaction.editReply({
        "embeds": [
            {
                "type": "rich",
                "title": `Skipped to the next song!`,
                "color": 0xe67c00,
            },
        ]
      });
    } else if(voiceInfo.loop == 1) {
        voiceInfo.queueInfo.voiceInfo.queueInfo.currentTrack = 0;
        let musicOut = await client.queue.get(interaction.guildId).queue[voiceInfo.queueInfo.currentTrack];
        let musicFile = `[${musicOut.display_id}]-${musicOut.epoch}.opus`
        let resource = createAudioResource(`../bin/${interaction.guildId}/ytdl/${musicFile}`);
        await player.play(resource);

        await interaction.editReply({
          "embeds": [
              {
                  "type": "rich",
                  "title": `Skipped to the start of queue!`,
                  "color": 0xe67c00,
              },
          ]
        });
    } else {
          await interaction.editReply({
            "embeds": [
                {
                    "type": "rich",
                    "title": `There is no song to skip to!`,
                    "color": 0xe67c00,
                },
            ]
          });
        }
	},
	type: 1,
};