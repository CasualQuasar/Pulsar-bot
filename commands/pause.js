const { SlashCommandBuilder } = require('discord.js');
const misc = require('../botMisc.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pauses the currently playing track.'),
	async execute(interaction) {
		await interaction.deferReply();
        if (await misc.initializeCommand(interaction)) {return};

        let client = interaction.client;

        client.queue.get(interaction.guildId).voice.player.pause();

        await interaction.editReply({
            "embeds": [
                {
                    "type": "rich",
                    "title": `Successfully paused the current playing song!`,
                    "color": 0xe67c00,
                },
            ]
        });
	},
	type: 1,
};