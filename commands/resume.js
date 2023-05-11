const { SlashCommandBuilder } = require('discord.js');
const misc = require('../botMisc.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resumes the current track.'),
	async execute(interaction) {
        await interaction.deferReply();
        if (await misc.initializeCommand(interaction)) {return};

        let client = interaction.client;

        client.queue.get(interaction.guildId).voice.player.unpause();

        await interaction.editReply({
            "embeds": [
                {
                    "type": "rich",
                    "title": `Successfully resumed the queue!`,
                    "color": 0xe67c00,
                },
            ]
        });
	},
	type: 1,
};