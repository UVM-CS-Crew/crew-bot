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