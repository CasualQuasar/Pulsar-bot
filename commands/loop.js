const { SlashCommandBuilder } = require('discord.js');
const misc = require('../botMisc.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('Loops the queue.'),
	async execute(interaction) {
		await interaction.deferReply();
		if (await misc.initializeCommand(interaction)) {return};
		
		client = interaction.client;
		
		if(client.queue.get(interaction.guildId).queueInfo.looping == 2)
			client.queue.get(interaction.guildId).queueInfo.looping = 0;
		else
			client.queue.get(interaction.guildId).queueInfo.looping++;

		await interaction.editReply({
			"embeds": [
				{
					"type": "rich",
					"title": generateResponse(client.queue.get(interaction.guildId).queueInfo.looping),
					"color": 0xe67c00,
				},
			]
		});
	},
	type: 1,
};

function generateResponse(loop)
{
	if(loop == 0)
		return "Stopped looping!"
	if(loop == 1)
		return "Now looping the queue!"
	if(loop == 2)
		return "Now looping the current track!"
}