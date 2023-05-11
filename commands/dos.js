const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dos')
		.setDescription('Gives the days of school left in the school year'),
	async execute(interaction) {

		await interaction.deferReply();

        await interaction.editReply({
            "embeds": [
                {
                    "type": "rich",
                    "title": `Days of school`,
                    "description": getDOS(),
                    "color": 0xe67c00,
                },
            ]
        });
	},
	type: 2,
};

function getDOS()
{
    let currentTime = new Date().getTime();
    let dos = "";
    let unixStamps = [1686858780000, 1718308380000];
    let yearIndex = -1;

    for(i = 0; i < unixStamps.length; i++)
        if(currentTime - unixStamps[i] < 0)
        {
            yearIndex = i;
            break;
        }

    if(yearIndex == -1)
        return "I wasn't programmed with this date yet. Ping Quasar and tell him to update it!!";

    let unixLeft = Math.abs(currentTime - unixStamps[yearIndex]);

    let days = Math.floor(unixLeft / 86400000);
    unixLeft -= Math.floor((unixLeft / 86400000)) * 86400000;

    let hours = Math.floor(unixLeft / 3600000);
    unixLeft -= Math.floor((unixLeft / 3600000)) * 3600000;

    let minutes = Math.floor(unixLeft / 60000);
    unixLeft -= Math.floor((unixLeft / 60000)) * 60000;
    
    let seconds = Math.floor(unixLeft / 1000);

    dos += "There are " + days + " days, " + hours + " hours, " + minutes + " minutes, and " + seconds + " seconds left";

    return dos;
}