const { SlashCommandBuilder } = require('discord.js');
const misc = require('../botMisc.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Displays a list of all the songs in queue.')
        .addIntegerOption(option => option.setName('page').setDescription('Page number to display.').setRequired(false)),
	async execute(interaction) {
		await interaction.deferReply();
        if (await misc.initializeCommand(interaction)) {return};

        let client = interaction.client;
        let page = interaction.options.getInteger('page'); 
        console.log("page: " + page)           

        if(!client.queue.get(interaction.guildId))
        {
            await interaction.editReply({
                "embeds": [
                    {
                        "type": "rich",
                        "title": `Queue: `,
                        "description": `Queue is empty!`,
                        "color": 0xe67c00,
                    },
                ]
            });
            return;
        }

        await interaction.editReply({
            "embeds": [
                {
                    "type": "rich",
                    "title": `Queue: `,
                    "description": await makeQueue(client, interaction, page),
                    "color": 0xe67c00,
                    "footer": {
                        "text": makeFooter(client, interaction),
                    }
                },
            ]
        });
	},
	type: 1,
};

async function makeQueue(client, interaction, page)
{

    currentTrack = client.queue.get(interaction.guildId).queueInfo.currentTrack;
    let start = 0;
    let queueString = "";

    console.log(page)

    if(!page) {
        start = ((currentTrack <= 15) ? 0 : Math.floor(currentTrack / 15)) * 15;
    }
    else if(client.queue.get(interaction.guildId).queue.length < 16 || page <= 1)
        start = 0;
    else
        start = (page - 1) * 15;

    console.log(start)

    for(let i = start; i < start + Math.min(15, client.queue.get(interaction.guildId).queue.length - start); i++)
    {
        let musicOut = await client.queue.get(interaction.guildId).queue[i]

        queueString += (currentTrack == i) ? `${i + 1}. **${musicOut.fulltitle} by ${musicOut.channel} [${musicOut.duration_string}]**` :
        `${i + 1}. ${musicOut.title} by ${musicOut.channel} [${musicOut.duration_string}]`;

        if(i + 1 < client.queue.get(interaction.guildId).queue.length)  
            queueString += '\n';
    }

    return queueString;
}

function makeFooter(client, interaction)
{
    let footer = `Total tracks: ${client.queue.get(interaction.guildId).queue.length} | Length: `;
    let total = 0;

    for(let i = client.queue.get(interaction.guildId).queueInfo.currentTrack; i < client.queue.get(interaction.guildId).queue.length; i++)
        total += client.queue.get(interaction.guildId).queue[i].duration;

    total -= client.queue.get(interaction.guildId).queueInfo.durationPassed;

    if(total < 60) {
        //if seconds are less than 1 minute and you only need mm:ss
        let result = new Date(total * 1000).toISOString().slice(17, 19);
        footer += result + ` sec.`
    }
    else if(total < 3600) {
        //if seconds are less than 1 minute and you only need mm:ss
        let result = new Date(total * 1000).toISOString().slice(14, 19);
        footer += result + ` min.`
    }
    else if(total < 86400) {
        //if seconds are less than 1 day and you only need hh:mm:ss
        let result = new Date(total * 1000).toISOString().slice(11, 19);
        footer += result + ` hours`
    }
    else if(total < 604800) {
        //if seconds are less than 1 week and you need dd:hh:mm:ss
        let result = new Date(total * 1000).toISOString().slice(11, 19);
        footer += result + ` days`
    }
    else {
        //if seconds are more than 1 week (uh oh)
        footer += `> 1 week`
    }  

    footer += ` remaining`
    return footer;

}