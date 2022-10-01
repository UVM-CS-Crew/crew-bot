const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = {
	cooldown: 5,
	ephemeral: false,
	data: new SlashCommandBuilder()
		.setName('xkcd')
		.setDescription('get the latest xkcd comic.'),
	async execute(interaction) {
		fetch('https://xkcd.com/info.0.json')
			.then(res => res.json())
			.then(res => {
				const xkcdEmbed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle(res.safe_title)
					.setURL('https://xkcd.com/')
					.setDescription(res.alt)
					.setImage(res.img);
				interaction.reply({ embeds: [xkcdEmbed], ephemeral: this.ephemeral });
			})
			.catch(error => {
				console.log('Error retrieving xkcd comic.\n', error);
				interaction.reply('Error retrieving xkcd comic.');
			});
	}
};