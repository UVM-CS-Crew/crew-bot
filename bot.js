const { buildSlashCommands, registerEvents } = require('./lib/functions/setup');

// create our bot client
const client = new Client({
	// disableMentions: 'everyone',
	// intents: [Intents.FLAGS.GUILDS]
	intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_PRESENCES', 'GUILD_MEMBERS']
});

// todo: CUSTOM_STATUS use to add custom status message?

const init = async () => {
	// future: set the bot settings from supabase
	client.settings = {};

	buildSlashCommands(client);
	registerEvents(client);

	client.login(process.env.DISCORD_KEY);
};

init();