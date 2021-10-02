const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	cooldown: 5,
	ephemeral: true,
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get helpful instructions for the bot'),
	async execute(interaction, client) {
		const data = [];

		//todo: decide on a way to have users ask for specific help, or
		// just list the whole thing out

		// depends on how many commands we will have in total
		// iirc, either select list, or choice list, are either 10 or 25
		// so one or the other or both could be a good way to show the command list
		// and let someone pick

		// alternatively, we scrap this command - and the description when a user
		// starts typing /${commandName} is enough.

		data.push('Here\'s a list of all my commands:');
		data.push(client.slashCommands.map(command => command.name).join(', '));

		interaction.reply({ content: data.toString(), ephemeral: this.ephemeral });
	},
};