// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits, Intents } = require('discord.js');
const { TOKEN } = require('./config.json');
const misc = require('./botMisc.js')
const chalk = require('chalk');

// Create a new client instance and declare intents
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.Guilds] });

//Create a collection to hold all of the information for every
//guild and its queue
client.queue = new Collection();
/*
[K,V] Pair
K = guildId
V = 
{
	"queue": ["[ytId]-UnixStamp", "[ytId]-UnixStamp", ...],
	"queueInfo": {
		"currentTrack": integer,
		"durationPassed": integer (seconds),
		"looping": integer (0 for no loop, 1 for queue, 2 for track),
	},
	"voice": {
		"voiceChannelId": integer,
		"connection": VoiceConnection,
		"player": AudioPlayer,
		"idleInterval": setInterval({}, 30000)
	},
	"recentTextChannel": Channel (channel that most recent command was sent)

}
*/

client.commands = new Collection();
client.events = new Collection();

require('./handlers/command-handler')(client);
require('./handlers/event-handler')(client);

const db = require("./handlers/database-handler");

db.conn.sync()
.then(() => {
	console.log("Synced db.");
})
.catch((err) => {
	console.log("Failed to sync db: " + err.message);
});

client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(misc.error(`No command matching ${interaction.commandName} was found.`));
		return;
	}

	try {
		console.log(misc.dimmed("Running command: " + chalk.underline.blue(interaction.commandName)))
		command.execute(interaction);
	} catch (error) {
		console.error(error);
		interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, async () => {
	console.log("I'm currently in the following guilds:")
	let guildIds = []
// Get all guilds that the client is in and that are .available
	let guildsCollection = await client.guilds.fetch()
// Iterate through each guild and add the id
	guildsCollection.forEach(async (val) => {
		guildIds.push(val.id)
	})

	for(let i = 0; i < guildIds.length; i++) {
		let guild = await guildsCollection.get(guildIds[i]).fetch()
		let owner = await guild.fetchOwner()
		console.log(misc.dimmed(guild.name) + chalk.magenta(" [") + chalk.yellow(guild.id) + chalk.magenta("]") + misc.dimmed(" owned by: ") + chalk.yellow(owner.user.tag))
	}
	

	console.log(chalk.bold.underline.greenBright(`Ready! Logged in as ${client.user.tag}`));
});

// Log in to Discord with your client's token
client.login(TOKEN);