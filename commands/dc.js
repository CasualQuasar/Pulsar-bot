const { SlashCommandBuilder } = require('discord.js');
const misc = require('../botMisc.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dc')
		.setDescription('Disconnects the bot from the & clears the queue.'),
	async execute(interaction) {
		await interaction.deferReply();
        if (await misc.initializeCommand(interaction)) {return};

        let client = interaction.client;
        let voiceInfo = client.queue.get(interaction.guildId);
        voiceInfo.recentTextChannel = interaction.channelId;

        let player = voiceInfo.voice.player;
        let voiceConnection = voiceInfo.voice.connection;

        voiceConnection.destroy();
        player.removeAllListeners();
        voiceConnection.removeAllListeners();
        client.queue.delete(interaction.guildId);
        misc.clearSongs(interaction.guildId)

        await interaction.editReply({
            "embeds": [
                {
                    "type": "rich",
                    "title": `Succesfully destroyed the player!`,
                    "description": 'Player was disconnected via the /dc command',
                    "color": 0xe67c00,
                },
            ]
        });
	},
	type: 1,
};