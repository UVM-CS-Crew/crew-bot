const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { readdirSync } = require('fs');


const putCommands = async (commands) => {
	// Place your client and guild ids here
	const clientId = 'CLIENTID'; // todo: add client id into an env var
	const guildId = 'GUILDID'; // todo: add guild id into an env var

	const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_KEY);

	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
};

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		// todo: explore new activity
		// set activity
		client.user.setActivity(`${client.settings.prefix}help`, { type: 'COMPETING' });

		const commandJsons = [];
		const slashCommandFolders = readdirSync('./slash-commands');
		// temporary allowed folders to make porting easier
		const allowedFolders = ['general'];

		for (const folder of slashCommandFolders) {
			if (allowedFolders.includes(folder)) {
				const innerCommandFiles = readdirSync(`./slash-commands/${folder}`).filter(file => file.endsWith('.js'));

				for (const file of innerCommandFiles) {
					// this requires the command name and file name to be the same
					if (
						(loadPartial && commandsToLoad.includes(file.split('.')[0]))
						|| loadAll
					) {
						const command = require(`../slash-commands/${folder}/${file}`);
						// todo: this build structure could use some love
						if (command.requireSetup) await command.build(); // might be setup() in some files, pick a name

						const commandAsJson = command.data.toJSON();
						commandJsons.push(commandAsJson);
					}
				}
			}
		}

		await putCommands(commandJsons);
	},
};