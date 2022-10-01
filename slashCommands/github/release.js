const { getLatestRelease, buildReleaseEmbed } = require('../../lib/functions/github');

module.exports = {
	cooldown: 2,
	ephemeral: true,
	config: {
		name: 'release',
		description: 'View the latest release.',
	},
	async execute(interaction) {
		await interaction.deferReply();

		const release = await getLatestRelease();
		if (release !== null) {
			const releaseEmbed = buildReleaseEmbed(release);
			interaction.followUp({ 
				embeds: [releaseEmbed], 
				ephemeral: this.ephemeral 
			});
		} else {
			interaction.followUp({ 
				content: 'Couldn\'t fetch the latest release, check the bot logs.', 
				ephemeral: this.ephemeral 
			});
		}
	}
};