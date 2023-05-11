const { SlashCommandBuilder } = require('discord.js');
const misc = require('../botMisc.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears the queue.'),
	async execute(interaction) {
		await interaction.deferReply();
        if (await misc.initializeCommand(interaction)) {return};
        
        let guildId = interaction.guildId
        let client = interaction.client;

        let voiceInfo = client.queue.get(interaction.guildId);
        voiceInfo.recentTextChannel = interaction.channelId;

        voiceInfo.queue = [];
        voiceInfo.voice.channelId = null;
        clearInterval(voiceInfo.voice.idleInterval)
        misc.clearSongs(interaction.guildId)


        await interaction.editReply({
            "embeds": [
                {
                    "type": "rich",
                    "title": `Successfully cleared the queue!`,
                    "color": 0xe67c00,
                },
            ]
        });
	},
	type: 1,
};