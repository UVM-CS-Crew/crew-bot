const { readdirSync } = require('fs');
const { REST } = require('@discordjs/rest');
const { Collection } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const CONFIG = require('../constants');

// setup slash commands
exports.buildSlashCommandsFiles = (client, slashCommandFolder) => {
	const slashCommandFolders = readdirSync(`./${slashCommandFolder}`);

	client.slashCommands = new Collection();
	client.slashCommandsCooldowns = new Collection();

	for (const folder of slashCommandFolders) {
		if (CONFIG.ENABLED_FOLDERS.includes(folder)) {
			const commandFiles = readdirSync(`./${CONFIG.SLASH_COMMAND_FOLDER_ROOT}/${folder}`).filter(file => file.endsWith('.js'));
			for (const file of commandFiles) {
				const command = require(`./${CONFIG.SLASH_COMMAND_FOLDER_ROOT}/${folder}/${file}`);
				client.slashCommands.set(command.data.name, command);
			}
		}
	}
};

// setup events
exports.registerEvents = (client) => {
	const eventFiles = readdirSync(CONFIG.EVENTS_FOLDER_ROOT);
	eventFiles.forEach(file => {
		const event = require(`${CONFIG.EVENTS_FOLDER_ROOT}/${file}`);
		// Bind the client to any event, before the existing arguments provided by the discord.js event.
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args, client));
		} else {
			client.on(event.name, (...args) => event.execute(...args, client));
		}
	});
};


exports.buildAndRegisterCommandJsons = async (loadPartial, loadAll, registerMethod, commandsToLoad) => {
	if (loadAll || loadPartial) {
		const commandJsons = [];
		const slashCommandFolders = readdirSync(CONFIG.SLASH_COMMAND_FOLDER_ROOT);

		for (const folder of slashCommandFolders) {
			if (CONFIG.ENABLED_FOLDERS.includes(folder)) {
				const innerCommandFiles = readdirSync(`${CONFIG.SLASH_COMMAND_FOLDER_ROOT}/${folder}`).filter(file => file.endsWith('.js'));
				for (const file of innerCommandFiles) {
					if ( // this requires the command name and file name to be the same
						(loadPartial && commandsToLoad.includes(file.split('.')[0]))
						|| loadAll
					) {
						const command = require(`../.${CONFIG.SLASH_COMMAND_FOLDER_ROOT}/${folder}/${file}`);

						// some commands need to make requests in order to build their options
						// or any other custom data, which is done in the build() method that
						// manipulates the .data property
						if (command.requireSetup) await command.build();
						
						const commandAsJson = command.data.toJSON();
						commandJsons.push(commandAsJson);
					}
				}
			}
		}
		// console.log(commandJsons);
		return await this.putCommands(commandJsons, registerMethod);
	} else {
		return false;
	}
};

exports.putCommands = async (commands, methodType) => {
	const clientId = process.env.DISCORD_CLIENT_ID;
	const guildId = process.env.DISCORD_GUILD_ID;
	let success = true;
//todo rest v update?
	const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_KEY);

	try {
		console.log('Started refreshing application (/) commands.');
		let res = [];

		if (methodType === 'PUT') {
			res = await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: commands },
			);
		} else {
			// todo: see if patch will not overrite commands
			// todo: this throws method not allowed, need to see how djs treats the discord docs
			// https://discord.com/developers/docs/interactions/application-commands#registering-a-command
			res = await rest.patch(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: commands },
			);
		}

		if (res?.length <= 0) {
			success = false;
		}
		if (success) {
			console.log('Successfully reloaded application (/) commands.');
		} else {
			console.log('Failed refreshing application (/) commands.');
		}
	} catch (error) {
		console.error(error);
		success = false;
	}

	return success;
};