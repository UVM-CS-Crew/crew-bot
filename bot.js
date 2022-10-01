const { buildSlashCommands, registerEvents } = require('./lib/functions/setup');
const { Client, GatewayIntentBits } = require('discord.js');

// create our bot client
const client = new Client({
	intents: [GatewayIntentBits.Guilds]
});

const init = async () => {
	// future: set the bot settings from supabase
	client.settings = {};

	buildSlashCommandsFiles(client);
	registerEvents(client);

	client.login(process.env.DISCORD_KEY);
};

init();