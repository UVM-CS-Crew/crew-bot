module.exports = {
	name: 'meeting',
    description: 'Info about the next CS Crew meeting.',
    cooldown: 5,
	execute(message, args) {
        let data = [];
        data.push('**Next CS Crew Meeting**');
        // meeting date for sure, then whatever you decide - topic, links, etc.?

		message.channel.send(data, {split: true});
	},
};

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	cooldown: 5,
	ephemeral: true,
	data: new SlashCommandBuilder()
		.setName('meeting')
		.setDescription('Info about the next CS Crew meeting.'),
	async execute(interaction, client) {
		const data = [];

        data.push('**Next CS Crew Meeting**');
        // meeting date for sure, then whatever you decide - topic, links, etc.?

		interaction.reply({ content: data.toString(), ephemeral: this.ephemeral });
	}
};