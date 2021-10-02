const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	cooldown: 5,
	ephemeral: true,
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Some basic info about the bot'),
	async execute(interaction, client) {
		const data = [];

        // if we want to do show contributors, can probably pull from github api and make it a different command
        // data.push('author: ');...

		data.push('CS Crew Discord bot');
		data.push(`\n- version: ${process.env.npm_package_version}`);
		data.push('\n- repo: https://github.com/cadeluca/pistachio-discord');
		data.push(`\n- See a lit of issues with /issues or legacy: \`${client.settings.prefix}issues\``);
		data.push(`\nView latest release info with /release or legacy: \`${client.settings.prefix}\`release`);

		interaction.reply({ content: data.toString(), ephemeral: this.ephemeral });
	}
};