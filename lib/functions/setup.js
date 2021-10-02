const { readdirSync } = require('fs');

exports.buildSlashCommands = (client, slashCommandFolder) => {
	// setup slash commands
	client.slashCommands = new Collection();
	client.slashCommandsCooldowns = new Collection();
	const slashCommandFolders = readdirSync(`./${slashCommandFolder}`);

	// temporary allowed folders to make porting easier
	const allowedFolders = ['general'];

	for (const folder of slashCommandFolders) {
		// aloowed folders is just temp to allow testing commands in a different folder
		if (allowedFolders.includes(folder)) {
			const commandFiles = readdirSync(`./${slashCommandFolder}/${folder}`).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {
				const command = require(`./${slashCommandFolder}/${folder}/${file}`);
				client.slashCommands.set(command.data.name, command);
			}
		}
	}
};

exports.registerEvents = (client) => {
	// setup events
	const eventFiles = readdirSync('./events'); // .filter(file => file.endsWith('.js'));, what non js file would belong in /events?
	eventFiles.forEach(file => {
		const event = require(`./events/${file}`);
		// Bind the client to any event, before the existing arguments provided by the discord.js event.
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args, client));
		} else {
			client.on(event.name, (...args) => event.execute(...args, client));
		}
	});
};