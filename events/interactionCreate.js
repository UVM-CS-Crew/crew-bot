module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
		// console.log(interaction);
		// If the interaction isn't a slash command, return
		// if (!interaction.isCommand() || !interaction.isMessageComponent()) return;
		// if (!interaction.isMessageComponent() && interaction.componentType !== 'BUTTON') return;

		if (interaction.isCommand()) {
			// fetch the command from our collection, so that we can have additional data outside of what discordjs has in the command manager.
			const command = client.slashCommands.get(interaction.commandName);
			// console.log(client.slashCommands);
			// console.log(command);
			if (!command) return;

			// no bots
			if (interaction.user.bot) return;

			// TODO: this isnt catching the discord api error
			try {
				// console.log(interaction);
				if (command.afterActions) {
					const interactionData = await command.execute(interaction, client);
					if (interactionData.trigger) {
						const message = await interaction.fetchReply();
						// console.log('reply message', message);
						command.afterReply(message, interaction.user, interactionData); // could pass in the data directly instead of foo.data
					}
				} else {
					command.execute(interaction, client);
				}

			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error trying to execute that command!', ephemeral: true });
			}

			// todo: re-add cooldowns
		}

		// TODO: make the select and button interactions, move the after reply behavior of the button component maybe out of it?
		// not totally sure, because might want the extra functionality i added - unless thats actually stored on the interaction
		// also need to see if i should handle it in these two ways for when its a multi select or single select

		if (interaction.isSelectMenu()) {
			// select menu interaction
			// console.log(interaction);
			const command = client.slashCommands.get(interaction.message.interaction.commandName);
			// console.log(command);
			command.executeSelect(interaction, client);

		}
		// if (interaction.isMessageComponent()) {
		// 	console.log('message interaction received');
		// }
	},
};