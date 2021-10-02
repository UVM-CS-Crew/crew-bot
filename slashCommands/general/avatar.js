const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	cooldown: 2,
	ephemeral: false, // this command doesnt use ephemeral but could
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('View a user\'s avatar')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('The user')),
	async execute(interaction) {
		const mention = interaction.options.getUser('user'); // is null when not specified
		if (mention) {
			interaction.reply(`${mention.username}'s avatar: <${mention.displayAvatarURL({ dynamic: true })}>`); // size: 2048, format: 'png'
		} else {
			interaction.reply(`Your avatar: <${interaction.user.displayAvatarURL({ dynamic: true })}>`);
		}
	}
};
